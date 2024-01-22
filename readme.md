## Commit Message Convention
[Angular Convention][angular convention]을 간소화 하여 사용
```
<type>: <subject>
```
추후 프로젝트 규모에 따라 `<scope>` 등 추가

[angular convention]: https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines

## Branch Policy
### Branch
- `master`
- `production`
- `feature/<name>`

### Flow
1. 새로운 기능 `A`를 위해 `master`로부터 `feature/A` 브랜치 생성
2. `feature/A`에서 기능 개발
3. `origin/master`를 기준으로 rebase, coflict 발생 시 해결
4. `feature/A`로부터 `master`로 pull request 생성 (필요 시 `draft` 지정)
5. 코드 리뷰
6. 모든 리뷰어가 승인 시, 다시 `origin/master`를 기준으로 rebase 후 merge