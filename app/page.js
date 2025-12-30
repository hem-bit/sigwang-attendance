'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  // 탭 상태
  const [activeTab, setActiveTab] = useState('member'); // 'member' or 'visitor'
  
  // 회원 출석 상태
  const [name, setName] = useState('');
  const [verificationType, setVerificationType] = useState('birth');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  
  // 방문자 등록 상태
  const [visitorName, setVisitorName] = useState('');
  const [visitorGender, setVisitorGender] = useState('');
  const [visitorPhone1, setVisitorPhone1] = useState('');
  const [visitorPhone2, setVisitorPhone2] = useState('');
  const [visitorPhone3, setVisitorPhone3] = useState('');
  const [visitorBirthYear, setVisitorBirthYear] = useState('');
  const [visitorBirthMonth, setVisitorBirthMonth] = useState('');
  const [visitorBirthDay, setVisitorBirthDay] = useState('');
  const [visitReason, setVisitReason] = useState('');
  
  // 공통 상태
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [memberType, setMemberType] = useState('');
  const [singeup, setSingeup] = useState('');
  const [education, setEducation] = useState('');
  const [showLink, setShowLink] = useState(false);

  // 회원 출석 체크 핸들러
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showMessage('이름을 입력해주세요.', 'error');
      return;
    }

    let verification = '';
    if (verificationType === 'birth') {
      if (!birthYear || !birthMonth || !birthDay) {
        showMessage('생년월일을 모두 입력해주세요.', 'error');
        return;
      }
      if (birthYear.length !== 4 || birthMonth.length !== 2 || birthDay.length !== 2) {
        showMessage('생년월일 형식을 확인해주세요.', 'error');
        return;
      }
      verification = `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`;
    } else {
      if (!phone1 || !phone2 || !phone3) {
        showMessage('연락처를 모두 입력해주세요.', 'error');
        return;
      }
      if (phone1.length !== 3 || phone2.length !== 4 || phone3.length !== 4) {
        showMessage('연락처 형식을 확인해주세요.', 'error');
        return;
      }
      verification = `${phone1}-${phone2}-${phone3}`;
    }

    setLoading(true);
    setMessage('');
    setMemberType('');
    setSingeup('');
    setEducation('');
    setShowLink(false);

    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          verification,
          verificationType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage(result.message, 'success');
        setMemberType(result.memberType);
        setSingeup(result.singeup || '');
        setEducation(result.education || '');
        setShowLink(result.showLink);
        
        setName('');
        setBirthYear('');
        setBirthMonth('');
        setBirthDay('');
        setPhone1('');
        setPhone2('');
        setPhone3('');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('오류가 발생했습니다. 다시 시도해주세요.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 방문자 등록 핸들러
  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    
    if (!visitorName.trim()) {
      showMessage('이름을 입력해주세요.', 'error');
      return;
    }

    setLoading(true);
    setMessage('');
    setMemberType('');
    setSingeup('');
    setEducation('');
    setShowLink(false);

    // 연락처 조합
    let phone = '';
    if (visitorPhone1 || visitorPhone2 || visitorPhone3) {
      phone = `${visitorPhone1}-${visitorPhone2}-${visitorPhone3}`;
    }

    // 생년월일 조합
    let birth = '';
    if (visitorBirthYear || visitorBirthMonth || visitorBirthDay) {
      birth = `${visitorBirthYear}-${visitorBirthMonth.padStart(2, '0')}-${visitorBirthDay.padStart(2, '0')}`;
    }

    try {
      const response = await fetch('/api/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: visitorName.trim(),
          gender: visitorGender,
          phone: phone,
          birth: birth,
          visitReason: visitReason,
        }),
      });

      const result = await response.json();

      if (result.success) {
        showMessage(result.message, 'success');
        
        // 폼 리셋
        setVisitorName('');
        setVisitorGender('');
        setVisitorPhone1('');
        setVisitorPhone2('');
        setVisitorPhone3('');
        setVisitorBirthYear('');
        setVisitorBirthMonth('');
        setVisitorBirthDay('');
        setVisitReason('');
      } else {
        showMessage(result.message, 'error');
      }
    } catch (error) {
      showMessage('오류가 발생했습니다. 다시 시도해주세요.', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  // 자동 포커스 핸들러들
  const handleYearInput = (value, setYear, nextId) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setYear(value);
      if (value.length === 4) {
        document.getElementById(nextId)?.focus();
      }
    }
  };

  const handleMonthInput = (value, setMonth, nextId) => {
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setMonth(value);
      if (value.length === 2) {
        document.getElementById(nextId)?.focus();
      }
    }
  };

  const handleDayInput = (value, setDay) => {
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setDay(value);
    }
  };

  const handlePhone1Input = (value, setPhone1Func, nextId) => {
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setPhone1Func(value);
      if (value.length === 3) {
        document.getElementById(nextId)?.focus();
      }
    }
  };

  const handlePhone2Input = (value, setPhone2Func, nextId) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPhone2Func(value);
      if (value.length === 4) {
        document.getElementById(nextId)?.focus();
      }
    }
  };

  const handlePhone3Input = (value, setPhone3Func) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPhone3Func(value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>✨ 출석체크</h1>
          <p>25' 시광교회 공동의회</p>
        </div>

        {/* 탭 버튼 */}
        <div className={styles.tabButtons}>
          <button
            type="button"
            className={activeTab === 'member' ? styles.active : ''}
            onClick={() => {
              setActiveTab('member');
              setMessage('');
              setMemberType('');
              setSingeup('');
              setEducation('');
              setShowLink(false);
            }}
          >
            회원 출석
          </button>
          <button
            type="button"
            className={activeTab === 'visitor' ? styles.active : ''}
            onClick={() => {
              setActiveTab('visitor');
              setMessage('');
              setMemberType('');
              setSingeup('');
              setEducation('');
              setShowLink(false);
            }}
          >
            방문자 등록
          </button>
        </div>

        {/* 회원 출석 탭 */}
        {activeTab === 'member' && (
          <form onSubmit={handleMemberSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                disabled={loading}
              />
            </div>

            <div className={styles.toggleButtons}>
              <button
                type="button"
                className={verificationType === 'birth' ? styles.active : ''}
                onClick={() => setVerificationType('birth')}
                disabled={loading}
              >
                생년월일
              </button>
              <button
                type="button"
                className={verificationType === 'phone' ? styles.active : ''}
                onClick={() => setVerificationType('phone')}
                disabled={loading}
              >
                연락처
              </button>
            </div>

            {verificationType === 'birth' && (
              <div className={styles.formGroup}>
                <label>생년월일</label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    id="birthYear"
                    value={birthYear}
                    onChange={(e) => handleYearInput(e.target.value, setBirthYear, 'birthMonth')}
                    placeholder="1992"
                    inputMode="numeric"
                    disabled={loading}
                    style={{ flex: 2 }}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    id="birthMonth"
                    value={birthMonth}
                    onChange={(e) => handleMonthInput(e.target.value, setBirthMonth, 'birthDay')}
                    placeholder="09"
                    inputMode="numeric"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    id="birthDay"
                    value={birthDay}
                    onChange={(e) => handleDayInput(e.target.value, setBirthDay)}
                    placeholder="12"
                    inputMode="numeric"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                </div>
                <div className={styles.hint}>연도(4자리) - 월(2자리) - 일(2자리)</div>
              </div>
            )}

            {verificationType === 'phone' && (
              <div className={styles.formGroup}>
                <label>연락처</label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    id="phone1"
                    value={phone1}
                    onChange={(e) => handlePhone1Input(e.target.value, setPhone1, 'phone2')}
                    placeholder="010"
                    inputMode="numeric"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    id="phone2"
                    value={phone2}
                    onChange={(e) => handlePhone2Input(e.target.value, setPhone2, 'phone3')}
                    placeholder="1234"
                    inputMode="numeric"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                  <span>-</span>
                  <input
                    type="text"
                    id="phone3"
                    value={phone3}
                    onChange={(e) => handlePhone3Input(e.target.value, setPhone3)}
                    placeholder="5678"
                    inputMode="numeric"
                    disabled={loading}
                    style={{ flex: 1 }}
                  />
                </div>
                <div className={styles.hint}>010 - 중간 4자리 - 끝 4자리</div>
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? '확인 중...' : '출석 체크하기'}
            </button>
          </form>
        )}

        {/* 방문자 등록 탭 */}
        {activeTab === 'visitor' && (
          <form onSubmit={handleVisitorSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="visitorName">
                이름 <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="visitorName"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="홍길동"
                disabled={loading}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>성별 <span className={styles.optional}>(선택)</span></label>
              <div className={styles.radioGroup}>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="남"
                    checked={visitorGender === '남'}
                    onChange={(e) => setVisitorGender(e.target.value)}
                    disabled={loading}
                  />
                  <label htmlFor="male">남</label>
                </div>
                <div className={styles.radioOption}>
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="여"
                    checked={visitorGender === '여'}
                    onChange={(e) => setVisitorGender(e.target.value)}
                    disabled={loading}
                  />
                  <label htmlFor="female">여</label>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>연락처 <span className={styles.optional}>(선택)</span></label>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  id="visitorPhone1"
                  value={visitorPhone1}
                  onChange={(e) => handlePhone1Input(e.target.value, setVisitorPhone1, 'visitorPhone2')}
                  placeholder="010"
                  inputMode="numeric"
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <span>-</span>
                <input
                  type="text"
                  id="visitorPhone2"
                  value={visitorPhone2}
                  onChange={(e) => handlePhone2Input(e.target.value, setVisitorPhone2, 'visitorPhone3')}
                  placeholder="1234"
                  inputMode="numeric"
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <span>-</span>
                <input
                  type="text"
                  id="visitorPhone3"
                  value={visitorPhone3}
                  onChange={(e) => handlePhone3Input(e.target.value, setVisitorPhone3)}
                  placeholder="5678"
                  inputMode="numeric"
                  disabled={loading}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>생년월일 <span className={styles.optional}>(선택)</span></label>
              <div className={styles.inputRow}>
                <input
                  type="text"
                  id="visitorBirthYear"
                  value={visitorBirthYear}
                  onChange={(e) => handleYearInput(e.target.value, setVisitorBirthYear, 'visitorBirthMonth')}
                  placeholder="1992"
                  inputMode="numeric"
                  disabled={loading}
                  style={{ flex: 2 }}
                />
                <span>-</span>
                <input
                  type="text"
                  id="visitorBirthMonth"
                  value={visitorBirthMonth}
                  onChange={(e) => handleMonthInput(e.target.value, setVisitorBirthMonth, 'visitorBirthDay')}
                  placeholder="09"
                  inputMode="numeric"
                  disabled={loading}
                  style={{ flex: 1 }}
                />
                <span>-</span>
                <input
                  type="text"
                  id="visitorBirthDay"
                  value={visitorBirthDay}
                  onChange={(e) => handleDayInput(e.target.value, setVisitorBirthDay)}
                  placeholder="12"
                  inputMode="numeric"
                  disabled={loading}
                  style={{ flex: 1 }}
                />
              </div>
              <div className={styles.hint}>연도(4자리) - 월(2자리) - 일(2자리)</div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="visitReason">
                방문동기 <span className={styles.optional}>(선택)</span>
              </label>
              <select
                id="visitReason"
                value={visitReason}
                onChange={(e) => setVisitReason(e.target.value)}
                disabled={loading}
              >
                <option value="">선택해주세요</option>
                <option value="일시방문">일시방문</option>
                <option value="교회 찾는 중">교회 찾는 중</option>
                <option value="등록 희망">등록 희망</option>
              </select>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? '등록 중...' : '방문자 등록하기'}
            </button>
          </form>
        )}

        {loading && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        )}

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        {memberType && (
          <div className={styles.memberTypeBox}>
            <p className={styles.memberTypeLabel}>교인구분</p>
            <div className={styles.memberTypeText}>{memberType}</div>
            <div className={styles.additionalInfo}>
              <div className={styles.infoRow}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>신급</div>
                  <div className={
                    singeup === '세례교인' || singeup === '입교' || singeup === '언약회원'
                      ? styles.textGreen 
                      : styles.textPink
                  }>{singeup || '-'}</div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>새가족교육</div>
                  <div className={
                    education === '이수' || education === '기존'
                      ? styles.textGreen 
                      : styles.textPink
                  }>{education || '-'}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showLink && (
          <div className={styles.linkBox}>
            <p>📱 투표방에 입장해주세요</p>
            <a
              href="https://invite.kakao.com/tc/JPBgcLntny"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.linkBtn}
            >
              투표방 입장하기
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
