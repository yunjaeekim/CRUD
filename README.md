# QA Style Fix

대상 브랜치: `feat/used-car-crud-v1`

## 수정 목적
- Safari에서 select 높이가 input보다 작게 보이는 문제 수정
- 약 1024px 이하 화면에서 메인 2열이 지나치게 좁아지는 문제 수정
- 카드와 패널의 grid overflow 방지
- 520px 이하 모바일 여백 및 목록 헤더 정리

## 적용
저장소의 기존 `style.css`를 이 파일로 교체한 후:

```bash
git checkout feat/used-car-crud-v1
git add style.css
git commit -m "fix: stabilize responsive layout and Safari form controls"
git push origin feat/used-car-crud-v1
```
