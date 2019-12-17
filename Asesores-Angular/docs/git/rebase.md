# Git rebase

> git checkout branch
> git rebase branch --preserve-merges

ejemplo

git pull origin develop
git checkout feat/B1
git rebase develop --preserve-merges


Por si se tiene problemas al hacer un push a la rama despues de haber hecho rebase
> git push branch --force
