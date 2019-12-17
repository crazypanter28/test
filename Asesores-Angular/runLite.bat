@echo off
setlocal EnableDelayedExpansion
color f2
cls

rem	For /f "eol=; tokens=1,2,3,4* delims=/, " %%i in ('date /t') do set FECHA=%%k%%j%%i 
rem	For /f "tokens=1-4 delims=:., " %%a in ('time /t') do set HORA=%%a%%b%%c 
rem	set path=%FECHA: =%%HORA%
	
rem IF EXIST dist (
rem	echo respaldando carpeta de distribucion anterior...............................................
rem	echo.
rem	echo %path%
rem	ren dist %path%
rem	move %path% c:\respaldos
rem ) ELSE ( 
rem   Echo LA CARPETA DIST NO EXISTE
rem )

echo Generando carpeta de distribucion...............................................
echo.

C:\Users\Osvaldo\AppData\Roaming\npm\\gulpAse1.cmd dist 
