@echo off
echo Cleaning up previous build...
rd /s /q dist

echo Installing dependencies...
call npm install

echo Building the project...
call npm run build

echo Deploying to GitHub Pages...
cd dist

echo Initializing git repository...
git init
git add -A
git commit -m "deploy"

echo Pushing to gh-pages branch...
git push -f https://github.com/sdjnzt/yutai-yucai-school-system.git master:gh-pages

cd ..
echo Deployment complete! 