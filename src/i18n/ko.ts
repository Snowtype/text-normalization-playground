/**
 * Korean UI dictionary. Same keys as `en.ts`; missing keys fall back to
 * English at lookup time, so partial coverage is safe.
 *
 * The `ambiguityCase.*` group localizes the ambiguity-showcase explanations,
 * keyed by the engine's own case identity (`${language}:${input}`) so the
 * engine data file stays free of presentation strings.
 */

export const ko: Record<string, string> = {
  // Nav
  'nav.playground': '플레이그라운드',
  'nav.whyNeural': '왜 신경망인가?',
  'nav.batch': '배치',
  'nav.tests': '테스트',

  // Hero
  'hero.pill': 'TTS 파이프라인 · 텍스트 정규화 단계',
  'hero.description':
    '**영어·한국어·일본어**를 지원하는, 테스트로 검증된 **규칙 기반** 텍스트 정규화(TN) 엔진 — 문자 표기(`$5`, `3시`, `3時`)를 TTS가 실제로 읽는 발화 표기로 바꾸는 단계입니다. 규칙이 어디서 한계에 부딪히고 어디서 **신경망 seq2seq** 모델이 필요해지는지에 대한 분석도 함께 담았습니다.',
  'hero.cta': '↓ 정규화기 써 보기',
  'hero.builtFor':
    '컬럼비아 대학 **Advanced Spoken Language Processing** 수업 프로젝트',

  // TTS pipeline diagram
  'pipeline.text.label': '텍스트',
  'pipeline.text.sub': '원문 입력',
  'pipeline.tn.label': '텍스트 정규화',
  'pipeline.tn.sub': '문자 표기 → 발화 표기',
  'pipeline.g2p.label': 'G2P',
  'pipeline.g2p.sub': '자소 → 음소',
  'pipeline.acoustic.label': '음향 모델',
  'pipeline.acoustic.sub': '음소 → 멜',
  'pipeline.vocoder.label': '보코더',
  'pipeline.vocoder.sub': '멜 → 파형',

  // Playground
  'playground.sectionTitle': '01 · 인터랙티브 정규화기',
  'playground.heading': '문자 표기를 넣으면 발화 표기가 나옵니다',
  'playground.subtitle':
    '입력하는 즉시 변환됩니다 — 버튼 없음. 비표준 토큰(숫자, 날짜, 금액, 단위…)만 바뀌고 일반 단어는 그대로 통과합니다.',
  'playground.inputLabel': '입력 — 문자 표기',
  'playground.outputLabel': '출력 — 발화 표기',
  'playground.normalizedCount': '{n}개 정규화됨',
  'playground.emptyHint':
    '출력이 입력과 같습니다 — 비표준 토큰이 없습니다. 숫자, 날짜, 시각, $, %, `12km` 같은 단위를 넣어 보거나, 언어 토글이 입력 텍스트와 맞는지 확인해 보세요.',
  'playground.traceLabel': '규칙 트레이스 — semiotic class별 묶음',
  'playground.placeholder.en': 'Type text with numbers, dates, money…',
  'playground.placeholder.ko': '숫자, 날짜, 금액이 포함된 문장을 입력하세요…',
  'playground.placeholder.ja': '数字・日付・金額を含む文を入力してください…',

  // Rule trace
  'trace.empty':
    '비표준 토큰이 없습니다. 이 트레이스에는 엔진이 적용한 모든 변환이 나열됩니다.',
  'trace.spanCount.one': '{n}개 스팬',
  'trace.spanCount.other': '{n}개 스팬',

  // Highlighted output
  'output.placeholder': '발화 표기가 여기에 표시됩니다…',

  // Semiotic legend
  'legend.sectionTitle': '02 · Semiotic class 커버리지',
  'legend.heading': '표준 TN 분류 체계',
  'legend.description':
    '모든 비표준 단어는 하나의 **semiotic class**에 속합니다. 상용 신경망 TN 모델이 태깅하도록 학습되는 것과 같은 분류이며, 이 엔진은 각 클래스마다 핸들러를 구현합니다.',

  // Ambiguity showcase
  'ambiguity.sectionTitle': '03 · 왜 신경망 TN인가?',
  'ambiguity.heading': '규칙이 한계에 부딪히고 문맥이 필요해지는 지점',
  'ambiguity.intro':
    '규칙은 패턴마다 하나의 읽기만 고를 수 있습니다. 하지만 많은 토큰의 올바른 발화 표기는 규칙이 볼 수 없는 주변 문맥에 따라 달라집니다. 아래 **규칙 기반 추정** 열은 이 엔진의 실제 출력이며 — 때로는 자신 있게 틀립니다.',
  'ambiguity.thInput': '입력',
  'ambiguity.thGuess': '규칙 기반 추정',
  'ambiguity.thWhy': '왜 중의적인가',
  'ambiguity.thContext': '문맥이 해소하는 방법',
  'ambiguity.contextLabel': '문맥:',
  'ambiguity.outroLead':
    '상용 TN이 신경망 seq2seq 모델을 쓰는 이유가 바로 이것입니다.',
  'ambiguity.outroBody':
    '`ByT5`, `mT5` 같은 바이트/문자 단위 인코더-디코더는 대규모 (문자 표기, 발화 표기) 쌍으로 학습되어 주변 문맥을 읽고 중의성을 해소합니다. 이 규칙 기반 시스템은 문맥과 무관한 고정 선택을 하므로 **중의성을 해소할 수 없습니다** — 대신 투명하고 강력한 기준선(baseline)이자, 신경망 모델이 반드시 풀어야 할 케이스의 정밀한 지도가 됩니다.',

  // Ambiguity cases (why / context per case)
  'ambiguityCase.en:1/2.why':
    '슬래시 표기는 날짜(월/일), 분수, 비율에 모두 쓰입니다. 세 글자만 봐서는 무엇인지 구분할 수 없습니다.',
  'ambiguityCase.en:1/2.context':
    '"Meeting on 1/2"면 날짜, "add 1/2 cup"이면 분수, "won 1/2 of games"면 비율 — 모델은 주변 단어를 읽고 판단합니다.',
  'ambiguityCase.en:Main St..why':
    '"St."는 Street와 Saint 둘 다의 약어입니다. 이 엔진은 항상 Saint로 확장합니다.',
  'ambiguityCase.en:Main St..context':
    '위치가 결정합니다: 도로명 뒤의 St.는 Street, "St. Louis"처럼 고유명사 앞이면 Saint.',
  'ambiguityCase.en:Dr. Smith lives on Sunset Dr..why':
    '같은 "Dr."가 이름 앞에서는 Doctor, 도로명 뒤에서는 Drive — 한 문장 안에서도 갈립니다.',
  'ambiguityCase.en:Dr. Smith lives on Sunset Dr..context':
    '모델은 "Dr."가 사람(Smith) 앞인지 장소(Sunset) 뒤인지를 보고 각각 다르게 읽습니다.',
  'ambiguityCase.en:2-3.why':
    '하이픈으로 이어진 숫자 쌍은 문맥에 따라 범위, 뺄셈, 월-일 날짜가 됩니다.',
  'ambiguityCase.en:2-3.context':
    '"2-3 days"는 범위, "2-3 = -1"은 뺄셈, "born 2-3"은 날짜 — 이웃 토큰이 결정합니다.',
  'ambiguityCase.en:Read pages 50-100, gates 50-100..why':
    '"50-100"이 페이지에서는 범위지만, 게이트·좌석 번호는 낱자리로 읽는 경우가 많습니다.',
  'ambiguityCase.en:Read pages 50-100, gates 50-100..context':
    '앞의 명사(pages냐 gates냐)가 읽기를 뒤집습니다. 규칙은 하나만 하드코딩할 수 있지만 모델은 둘 다 학습합니다.',
  'ambiguityCase.ko:3시.why':
    '시각은 고유어 수사(세 시)를 쓰지만, 같은 숫자라도 대부분의 다른 분류사 앞에서는 한자어(삼)를 씁니다. 숫자만 봐서는 어느 체계인지 알 수 없습니다.',
  'ambiguityCase.ko:3시.context':
    "분류사 '시'가 고유어 체계를 요구합니다. 모델은 분류사→수사 체계 매핑을 예외까지 통째로 학습합니다.",
  'ambiguityCase.ko:1/2.why':
    "영어와 마찬가지로 슬래시는 날짜, 분수(분모 먼저 — '2분의 1'!), 비율이 공유합니다.",
  'ambiguityCase.ko:1/2.context':
    '한국어 분수는 피연산자 순서까지 바뀌므로(2분의 1), 모델은 분류와 재배열을 동시에 해야 합니다.',
  'ambiguityCase.ko:100원.why':
    "돈은 한자어(백 원)로 읽지만, 고유어 분류사와의 유추나 어색한 '일' 삽입(일백 원) 같은 오류가 흔합니다.",
  'ambiguityCase.ko:100원.context':
    "모델은 발화 말뭉치에서 원→한자어 규칙과 첫 '일'의 자연스러운 탈락을 학습합니다.",
  'ambiguityCase.ko:2배.why':
    "'배'(곱절)는 고유어 수사를 받지만, 배는 동음이의어(선박·과일·신체)라 분류사 의미부터 판별해야 합니다.",
  'ambiguityCase.ko:2배.context':
    '배의 의미 판별 + 수사 체계 선택 — 평면적인 규칙이 할 수 없는 두 단계의 결합 판단입니다.',
  'ambiguityCase.ja:1日.why':
    '1日는 달력 날짜면 ついたち, 기간이면 いちにち — 표기는 같은데 읽기가 둘입니다.',
  'ambiguityCase.ja:1日.context':
    '조사와 주변 단어가 결정합니다(1日に→날짜, 1日中→기간). 이 규칙은 항상 ついたち를 고릅니다.',
  'ambiguityCase.ja:4時.why':
    '한자 숫자 4는 읽기가 세 개(し/よん/よ)이고, 무엇이 맞는지는 뒤에 오는 조수사가 정하는 어휘적 결정입니다.',
  'ambiguityCase.ja:4時.context':
    '조수사가 읽기를 고릅니다(時→よ, 月→し, 기본 세기→よん). 신경망 모델은 예외를 포함한 전체 표를 학습합니다.',
  'ambiguityCase.ja:1/2.why':
    '영어·한국어처럼 슬래시를 날짜·분수·비율이 공유하며, 일본어 분수도 분모를 먼저 읽습니다(2分の1).',
  'ambiguityCase.ja:1/2.context':
    '의미 분류에 더해 분수는 피연산자 재배열까지 필요합니다 — 단순 치환으로는 불가능합니다.',

  // Batch & metrics
  'batch.sectionTitle': '04 · 배치 & 지표',
  'batch.heading': '여러 줄을 한꺼번에 정규화하고 커버리지 측정',
  'batch.inputLabel': '줄 단위로 붙여넣기 — 한 줄에 한 발화',
  'batch.statLines': '줄 수',
  'batch.statTokens': '정규화된 토큰',
  'batch.statClasses': '검출된 클래스',
  'batch.distLabel': 'Semiotic class별 분포',
  'batch.chartEmpty': '아직 정규화된 토큰이 없습니다.',

  // Test suite
  'tests.sectionTitle': '05 · 테스트 스위트',
  'tests.heading': 'Vitest 코퍼스를 실시간으로 평가',
  'tests.description':
    '하나의 공유 소스(`src/tn/testCases.ts`)가 `npm test`와 이 화면을 동시에 구동합니다.',
  'tests.thClass': '클래스',
  'tests.thInput': '입력',
  'tests.thExpected': '기대값 (발화 표기)',
  'tests.thStatus': '상태',
  'tests.allPassing': '✓ 전체 통과',
  'tests.failures': '✗ 실패 있음',
  'tests.gotLabel': '실제:',

  // Footer
  'footer.scopeTitle': '범위 & 정직성 노트',
  'footer.scopeText':
    '이 사이트는 **규칙 기반 TN 기준선**과 중의성 분석입니다 — 뒤에서 돌아가는 학습된 신경망 모델은 없습니다. 가치는 정확하고 투명하며 테스트로 검증된 규칙 엔진, 그리고 신경망 seq2seq TN(ByT5/mT5)이 필요해지는 케이스의 정밀한 지도에 있습니다. TN 문제 공간을 끝까지 이해하기 위해 만들었습니다.',
  'footer.tagline':
    'Text Normalization Playground · 영어·한국어·일본어 규칙 기반 TN',
  'footer.builtFor':
    '컬럼비아 대학 **Advanced Spoken Language Processing** 수업 프로젝트',

  // Semiotic class labels — bilingual (English code + Korean gloss)
  'class.CARDINAL': 'CARDINAL (기수)',
  'class.ORDINAL': 'ORDINAL (서수)',
  'class.DECIMAL': 'DECIMAL (소수)',
  'class.DATE': 'DATE (날짜)',
  'class.TIME': 'TIME (시각)',
  'class.MONEY': 'MONEY (금액)',
  'class.PERCENT': 'PERCENT (백분율)',
  'class.MEASURE': 'MEASURE (수량·단위)',
  'class.TELEPHONE': 'TELEPHONE (전화번호)',
  'class.DIGIT': 'DIGIT (낱자리 수)',
  'class.ELECTRONIC': 'ELECTRONIC (전자 표기)',
  'class.ABBREVIATION': 'ABBREVIATION (약어)',
  'class.PLAIN': 'PLAIN (일반)',

  // Semiotic class blurbs
  'classBlurb.CARDINAL': '개수를 세는 수.',
  'classBlurb.ORDINAL': '순서·순위를 나타내는 수.',
  'classBlurb.DECIMAL': '소수점이 있는 수.',
  'classBlurb.DATE': '달력 날짜.',
  'classBlurb.TIME': '시각.',
  'classBlurb.MONEY': '금액.',
  'classBlurb.PERCENT': '백분율.',
  'classBlurb.MEASURE': '단위·분류사가 붙는 수량.',
  'classBlurb.TELEPHONE': '전화번호 — 낱자리로 읽음.',
  'classBlurb.DIGIT': '낱자리로 읽는 식별 번호.',
  'classBlurb.ELECTRONIC': 'URL과 이메일 주소.',
  'classBlurb.ABBREVIATION': '줄임말을 원형으로 확장.',
  'classBlurb.PLAIN': '그대로 두는 일반 단어.',
};
