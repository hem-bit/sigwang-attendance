# 시광교회 출석 체크 시스템 - Vercel 배포 가이드

## ✅ 준비 완료 항목
- [x] Google Cloud 프로젝트 생성
- [x] Google Sheets API 활성화
- [x] 서비스 계정 생성 및 JSON 키 다운로드
- [x] Google Sheets에 서비스 계정 권한 부여
- [x] 웹 앱 코드 작성 완료

---

## 📦 배포 단계

### 1단계: GitHub에 코드 업로드

#### 방법 1: GitHub Desktop 사용 (추천, 가장 쉬움)

1. **GitHub Desktop 다운로드 및 설치**
   - https://desktop.github.com 접속
   - 다운로드 및 설치
   - GitHub 계정으로 로그인

2. **새 저장소 생성**
   - File → New Repository
   - Name: `sigwang-attendance`
   - Local Path: 코드가 있는 폴더 선택 (`attendance-vercel` 폴더)
   - Initialize this repository with a README: 체크 해제
   - Create Repository 클릭

3. **GitHub에 업로드**
   - Publish repository 클릭
   - Keep this code private: 체크 (비공개로 유지)
   - Publish repository 클릭

#### 방법 2: GitHub 웹사이트 직접 업로드

1. https://github.com 접속 및 로그인
2. 오른쪽 위 **+** 클릭 → **New repository**
3. Repository name: `sigwang-attendance`
4. Private 선택
5. Create repository 클릭
6. **uploading an existing file** 클릭
7. `attendance-vercel` 폴더의 모든 파일을 드래그 앤 드롭
8. Commit changes 클릭

---

### 2단계: Vercel 계정 생성 및 프로젝트 연결

1. **Vercel 접속**
   - https://vercel.com 접속
   - **Continue with GitHub** 클릭
   - GitHub 계정으로 로그인 및 권한 승인

2. **새 프로젝트 생성**
   - **Add New...** → **Project** 클릭
   - GitHub 저장소 목록에서 `sigwang-attendance` 찾기
   - **Import** 클릭

3. **프로젝트 설정**
   - Project Name: `sigwang-attendance` (그대로 사용)
   - Framework Preset: **Next.js** (자동 감지됨)
   - Root Directory: `./` (그대로 사용)
   
---

### 3단계: 환경 변수 설정 (매우 중요!)

**Deploy 버튼을 누르기 전에** 환경 변수를 먼저 설정해야 합니다!

1. **Environment Variables 섹션 펼치기**

2. **SPREADSHEET_ID 추가**
   - Name: `SPREADSHEET_ID`
   - Value: Google Sheets URL에서 ID 복사
   ```
   예시 URL:
   https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0/edit
   
   ID는: 1a2b3c4d5e6f7g8h9i0
   ```
   - Add 클릭

3. **GOOGLE_CREDENTIALS_BASE64 추가**
   
   이 부분이 가장 중요합니다!
   
   **3-1. JSON 키를 Base64로 변환**
   
   **Windows 사용자:**
   ```powershell
   # PowerShell 열기
   # JSON 파일이 있는 폴더로 이동
   cd Downloads  # 또는 JSON 파일이 있는 경로
   
   # Base64로 변환 (파일명을 본인의 JSON 파일명으로 변경)
   [Convert]::ToBase64String([System.IO.File]::ReadAllBytes("본인의-JSON-파일명.json"))
   ```
   
   **Mac 사용자:**
   ```bash
   # 터미널 열기
   # JSON 파일이 있는 폴더로 이동
   cd ~/Downloads  # 또는 JSON 파일이 있는 경로
   
   # Base64로 변환 (파일명을 본인의 JSON 파일명으로 변경)
   base64 -i 본인의-JSON-파일명.json
   ```
   
   **3-2. 출력된 긴 문자열을 모두 복사**
   - 매우 긴 문자열이 출력됩니다 (수백~수천 자)
   - 전체를 복사하세요
   
   **3-3. Vercel에 추가**
   - Name: `GOOGLE_CREDENTIALS_BASE64`
   - Value: 복사한 Base64 문자열 붙여넣기
   - Add 클릭

4. **환경 변수 확인**
   
   다음 2개가 있어야 합니다:
   - ✅ SPREADSHEET_ID
   - ✅ GOOGLE_CREDENTIALS_BASE64

---

### 4단계: 배포

1. **Deploy 버튼 클릭**
2. 배포 진행 (2-3분 소요)
3. 축하 화면이 나오면 **Visit** 클릭
4. 출석 체크 앱이 열립니다!

---

### 5단계: URL 확인 및 QR 코드 생성

1. **배포된 URL 복사**
   - 형식: `https://sigwang-attendance-xxxxx.vercel.app`
   - 또는 Vercel 대시보드 → Domains에서 확인

2. **QR 코드 생성**
   - https://www.qr-code-generator.com 접속
   - URL 입력
   - QR 코드 다운로드

3. **테스트**
   - 여러 브라우저에서 테스트
   - 다른 Google 계정으로 로그인된 상태에서도 테스트
   - 스마트폰에서 QR 스캔 테스트

---

## 🔧 문제 해결

### "Application error: a client-side exception has occurred"
- 환경 변수가 제대로 설정되지 않았을 가능성
- Vercel 대시보드 → Settings → Environment Variables 확인
- 환경 변수 수정 후 → Deployments → 최신 배포 → Redeploy

### "Failed to fetch"
- Google Sheets API 권한 확인
- 서비스 계정 이메일이 Sheets에 편집자 권한으로 추가되었는지 확인

### 시트 이름 오류
- `app/api/attendance/route.js` 파일의 6번째 줄 확인:
  ```javascript
  const SHEET_NAMES = ['청년1부', '청년2부', '장년부', '주일학교', '신촌캠', '교역자'];
  ```
- 실제 Google Sheets의 시트 이름과 정확히 일치하는지 확인

---

## 🎯 장점

이제 다음 문제들이 모두 해결되었습니다:

✅ **Google 계정 로그인 불필요**
✅ **계정 충돌 문제 없음**
✅ **"파일을 열 수 없습니다" 에러 없음**
✅ **모든 브라우저에서 작동**
✅ **모바일 최적화**
✅ **빠른 속도**
✅ **무료 호스팅**

---

## 📞 추가 지원

문제가 발생하면 다음 정보와 함께 문의해주세요:
1. 어느 단계에서 문제가 발생했나요?
2. 정확한 에러 메시지는?
3. 스크린샷 (가능하면)

---

## ✅ 체크리스트

배포 전 확인:
- [ ] GitHub에 코드 업로드 완료
- [ ] Vercel 계정 생성 및 프로젝트 Import
- [ ] SPREADSHEET_ID 환경 변수 추가
- [ ] GOOGLE_CREDENTIALS_BASE64 환경 변수 추가
- [ ] Deploy 버튼 클릭
- [ ] URL 확인
- [ ] QR 코드 생성
- [ ] 테스트 완료

🎉 모두 완료되면 공동의회에서 사용 가능합니다!
