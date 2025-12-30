import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Google Sheets 설정
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAMES = ['청년1부', '청년2부', '장년부', '주일학교', '신촌캠', '교역자', '시선교회'];

// Google Sheets API 클라이언트 생성
function getGoogleSheetsClient() {
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString('utf-8')
  );

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

// 날짜 형식 통일
function formatDate(dateInput) {
  if (!dateInput) return '';
  
  const str = String(dateInput).trim();
  
  // YYYY-MM-DD 형식
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  
  // YYYY.MM.DD 또는 YYYY/MM/DD 형식
  if (/^\d{4}[.\/]\d{2}[.\/]\d{2}$/.test(str)) {
    return str.replace(/[.\/]/g, '-');
  }
  
  return str;
}

// 전화번호 형식 통일
function formatPhone(phoneInput) {
  if (!phoneInput) return '';
  return String(phoneInput).replace(/[^0-9]/g, '');
}

export async function POST(request) {
  try {
    const { name, verification, verificationType } = await request.json();

    if (!name || !verification || !verificationType) {
      return NextResponse.json({
        success: false,
        message: '필수 정보가 누락되었습니다.',
      });
    }

    const sheets = getGoogleSheetsClient();

    // 모든 시트를 순회하며 회원 검색
    for (const sheetName of SHEET_NAMES) {
      try {
        // 시트 데이터 가져오기
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A:J`,
        });

        const rows = response.data.values;
        
        if (!rows || rows.length <= 1) {
          continue; // 데이터가 없으면 다음 시트로
        }

        // 헤더 행
        const headers = rows[0];
        
        // 디버깅: 모든 헤더 출력
        console.log(`Sheet: ${sheetName}, Headers:`, headers);
        
        const nameCol = headers.indexOf('이름');
        const birthCol = headers.indexOf('생년월일');
        const phoneCol = headers.indexOf('연락처');
        const singeupCol = headers.indexOf('신급');
        const educationCol = headers.indexOf('새가족교육');
        const memberTypeCol = headers.indexOf('교인구분');
        const attendanceCol = headers.indexOf('출석');
        
        // 디버깅: 컬럼 인덱스 출력
        console.log('Column indices:', {
          nameCol,
          birthCol,
          phoneCol,
          singeupCol,
          educationCol,
          memberTypeCol,
          attendanceCol
        });

        // 컬럼 확인 (필수 컬럼만)
        if (nameCol === -1 || birthCol === -1 || phoneCol === -1 || 
            memberTypeCol === -1 || attendanceCol === -1) {
          continue;
        }

        // 회원 찾기
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0) continue;

          const rowName = String(row[nameCol] || '').trim();

          // 이름 확인
          if (rowName !== name.trim()) {
            continue;
          }

          // 생년월일 또는 연락처 확인
          let verified = false;
          if (verificationType === 'birth') {
            const rowBirth = formatDate(row[birthCol]);
            const inputBirth = formatDate(verification);
            verified = (rowBirth === inputBirth);
          } else if (verificationType === 'phone') {
            const rowPhone = formatPhone(row[phoneCol]);
            const inputPhone = formatPhone(verification);
            verified = (rowPhone === inputPhone);
          }

          if (!verified) {
            return NextResponse.json({
              success: false,
              message: '입력하신 정보가 일치하지 않습니다.',
            });
          }

          // 교인구분 확인
          const memberType = String(row[memberTypeCol] || '').trim();
          const singeup = String(row[singeupCol] || '').trim();
          const education = String(row[educationCol] || '').trim();

          // 디버깅: 실제 데이터 로깅
          console.log('Debug - Row data:', {
            name: rowName,
            memberType,
            singeup,
            education,
            singeupCol,
            educationCol,
            headers
          });

          if (memberType !== '정회원' && memberType !== '준회원' && memberType !== '새가족') {
            return NextResponse.json({
              success: false,
              message: '등록된 교인구분 정보가 올바르지 않습니다.\n관리자에게 문의해주세요.',
              invalidMemberType: true,
            });
          }

          // 출석 체크 (TRUE로 업데이트)
          const rowIndex = i + 1; // 1-based index
          const columnLetter = String.fromCharCode(65 + attendanceCol); // A=65
          await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!${columnLetter}${rowIndex}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [[true]],
            },
          });

          // 성공 응답
          return NextResponse.json({
            success: true,
            message: `${name}님, 출석이 완료되었습니다!`,
            memberType: memberType,
            singeup: singeup,
            education: education,
            department: sheetName,
            showLink: memberType === '정회원',
          });
        }
      } catch (sheetError) {
        console.error(`Error processing sheet ${sheetName}:`, sheetError);
        continue;
      }
    }

    // 모든 시트를 검색했지만 회원을 찾지 못함
    return NextResponse.json({
      success: false,
      message: '등록된 회원 정보를 찾을 수 없습니다.',
    });

  } catch (error) {
    console.error('Error in attendance API:', error);
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }, { status: 500 });
  }
}
