'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [name, setName] = useState('');
  const [verificationType, setVerificationType] = useState('birth');
  const [birthYear, setBirthYear] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [phone1, setPhone1] = useState('');
  const [phone2, setPhone2] = useState('');
  const [phone3, setPhone3] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [memberType, setMemberType] = useState('');
  const [singeup, setSingeup] = useState('');
  const [education, setEducation] = useState('');
  const [showLink, setShowLink] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 입력 검증
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
        
        // 폼 리셋
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

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const handleYearInput = (value) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setBirthYear(value);
      if (value.length === 4) {
        document.getElementById('birthMonth')?.focus();
      }
    }
  };

  const handleMonthInput = (value) => {
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setBirthMonth(value);
      if (value.length === 2) {
        document.getElementById('birthDay')?.focus();
      }
    }
  };

  const handleDayInput = (value) => {
    if (value.length <= 2 && /^\d*$/.test(value)) {
      setBirthDay(value);
    }
  };

  const handlePhone1Input = (value) => {
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setPhone1(value);
      if (value.length === 3) {
        document.getElementById('phone2')?.focus();
      }
    }
  };

  const handlePhone2Input = (value) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPhone2(value);
      if (value.length === 4) {
        document.getElementById('phone3')?.focus();
      }
    }
  };

  const handlePhone3Input = (value) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPhone3(value);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>✨ 출석체크</h1>
          <p>25' 시광교회 공동의회</p>
        </div>

        <form onSubmit={handleSubmit}>
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
                  onChange={(e) => handleYearInput(e.target.value)}
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
                  onChange={(e) => handleMonthInput(e.target.value)}
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
                  onChange={(e) => handleDayInput(e.target.value)}
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
                  onChange={(e) => handlePhone1Input(e.target.value)}
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
                  onChange={(e) => handlePhone2Input(e.target.value)}
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
                  onChange={(e) => handlePhone3Input(e.target.value)}
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
                    singeup === '세례교인' || singeup === '입교' 
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
