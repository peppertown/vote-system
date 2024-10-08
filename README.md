주제 : 간단한 온라인 투표 시스템

참고하면 좋을 자료 : 구글 폼

[REST Resource: forms  |  Google Forms  |  Google for Developers](https://developers.google.com/forms/api/reference/rest/v1/forms?hl=ko)

프로젝트 초기설정

우리 프로젝트 깃헙.

[GitHub - chaesunbak/vote-system](https://github.com/chaesunbak/vote-system)

1. 팀장(@문성 채 )에게 우리 프로젝트 권한을 받는다.(DM으로 깃헙 아이디 보내주면 초대 수락 이메일 보내드림.)
2. 위 프로젝트를 **포크(매우 중요)**한다. (내 소유의 레포 생김)
3. 내 IDE에서 내 레포를 클론한다.
4. 코드 작업하고 PR 하면 내꺼에 Push됨
5. 우리 프로젝트 레포에 PR 한다.
6. Merge하기 위해서는 다른 한명의 코드리뷰를 받아야 한다.
7. PR 한사람이 머지한다.
8. 머지 후에 (싱크 포크 → 업데이트 브랜치)로 내 프로젝트를 최신화 한다.
9. 그다음에 내 로컬도 최신화한다.

**주의점** PR 하기전에 싱크 업데이트 무조건 하고 하기

프로젝트 오너(팀장은 dev브랜치 만들어서 main에 PR)

논의한 사항

1. MySQL2에서 프로미스와 콜백이 있는데 프로미스로 해볼까?
2. 모듈 require말고 import로 해볼까?
3. 복잡하게 하지말고 간단하게

투표 하나당 질문은 하나(객관식) ← 확정

유저 생성시 개인정보 받을지 ←확정

투표 생성시 모두에게 열린 걸로 ←확정

다음 미팅날짜는 슬랙으로

해야할 일

- [ ] 프로젝트 기본설정해서 깃 업로드 (문성)
- [ ] API 문서 작성
- [ ] db 설계 [dbdaigram.io](http://dbdaigram.io) 후 테이블 설정 SQL 작성
- [ ] 더미데이터 생성 SQL 작성
- [ ] 포스트맨 설정
- [ ] users api 구현 회원가입/로그인/로그아웃/사용자 정보조회
- [ ] polls api 구현 투표생성/모든 투표조회 (조건 추가할수 있으면 좋음) / 투표 개별 조회/ 투표 종료(본인이 생성한거만)
- [ ] vote api polls/:id/vote 투표하기
- [ ] result api 투표 결과 조회하기 (하나? 여러개?)
