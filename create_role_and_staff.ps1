Invoke-RestMethod -Method Post -Uri "http://localhost:5194/api/roles" -ContentType "application/json" -InFile ".\role_seed.json"
Invoke-RestMethod -Method Post -Uri "http://localhost:5194/api/staff" -ContentType "application/json" -InFile ".\staff_seed.json"
