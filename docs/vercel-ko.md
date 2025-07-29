# Vercel 사용 방법

## 새 프로젝트 생성 방법
이 프로젝트를 Github에서 포크한 후, 다시 배포하려면 Vercel에서 새로운 Vercel 프로젝트를 생성해야 하며, 다음 단계를 따라야 합니다.

![vercel-create-1](./images/vercel/vercel-create-1.jpg)
1. Vercel 콘솔 홈 페이지로 이동합니다;
2. 새로 추가를 클릭합니다;
3. 프로젝트를 선택합니다.

![vercel-create-2](./images/vercel/vercel-create-2.jpg)
1. Git 리포지토리 가져오기에서 chatgpt-next-web을 검색합니다.
2. 새로 포크된 프로젝트를 선택하고 가져오기를 클릭합니다.

![vercel-create-3](./images/vercel/vercel-create-3.jpg)
1. 프로젝트 구성 페이지에서 환경 변수 설정을 클릭하여 환경 변수 설정을 시작합니다;
2. OPENAI_API_KEY, CODE ([Access Code](https://github.com/Yidadaa/ChatGPT-Next-Web/blob/357296986609c14de10bf210871d30e2f67a8784/docs/faq-cn.md#%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F-code-%E6%98%AF%E4%BB%80%E4%B9%88%E5%BF%85%E9%A1%BB%E8%AE%BE%E7%BD%AE%E5%90%97)). 환경 변수를 설정합니다;
3. 환경 변수의 값을 입력합니다;
4. 추가를 클릭하여 환경 변수 추가를 확인합니다;
5. OPENAI_API_KEY를 추가해야 하며, 그렇지 않으면 작동하지 않습니다;
6. 배포를 클릭하여 도메인 이름 생성을 완료하고 배포가 완료될 때까지 약 5분간 기다립니다.

## 사용자 정의 도메인 네임 추가 방법
[TODO]

## 환경 변수 변경 방법
![vercel-env-edit](./images/vercel/vercel-env-edit.jpg)
1. 버셀 프로젝트의 내부 콘솔로 이동하여 상단의 설정 버튼을 클릭합니다;
2. 왼쪽의 환경 변수를 클릭합니다;
3. 기존 항목 오른쪽에 있는 버튼을 클릭합니다;
4. 편집을 선택하여 수정하고 저장합니다.

⚠️️ 참고: 환경 변수를 변경할 때마다 [프로젝트를 재배포](#如何重新部署)해야 변경 사항을 적용할 수 있습니다!

## 재배포 방법
![vercel-redeploy](./images/vercel/vercel-redeploy.jpg)
1. 버셀 내부 프로젝트 콘솔로 이동하여 상단의 배포 버튼을 클릭합니다;
2. 목록에서 맨 위 항목 오른쪽에 있는 버튼을 선택합니다;
3. 재배포를 클릭하여 재배포합니다.