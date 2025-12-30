import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Google Sheets 설정
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const VISITOR_SHEET_NAME = '방문자';

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

export async function POST(request) {
  try {
    const { name, gender, phone, birth, visitReason } = await request.json();

    // 필수 항목 확인
    if (!name || !name.trim()) {
      return NextResponse.json({
        success: false,
        message: '이름을 입력해주세요.',
      });
    }

    const sheets = getGoogleSheetsClient();

    // 현재 시간 (한국 시간)
    const now = new Date();
    const koreaTime = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const timestamp = koreaTime.toISOString().replace('T', ' ').substring(0, 19);

    // 방문자 시트에 데이터 추가
    const values = [[
      timestamp,           // 등록시간
      name.trim(),         // 이름
      gender || '',        // 성별
      phone || '',         // 연락처
      birth || '',         // 생년월일
      visitReason || ''    // 방문동기
    ]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${VISITOR_SHEET_NAME}!A:F`,
      valueInputOption: 'RAW',
      requestBody: {
        values: values,
      },
    });

    return NextResponse.json({
      success: true,
      message: `${name}님, 등록이 완료되었습니다!\n환영합니다 🙏`,
    });

  } catch (error) {
    console.error('Error in visitor registration API:', error);
    return NextResponse.json({
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    }, { status: 500 });
  }
}
