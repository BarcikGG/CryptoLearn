@echo off

cd /d "C:\Users\danil\Desktop\CryptoLearn\client"
start cmd /k "expo start --tunnel"

cd /d "C:\Users\danil\Desktop\CryptoLearn\server"
start cmd /k "npm run dev"

cd /d "C:\Users\danil\Desktop\CryptoLearn\server"
start cmd /k "ngrok http 8080"
