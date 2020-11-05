# CryptoDashboard

This project will run on the presumption of an existing database using SQL Server. 
If you do not have a SQL Server instance, please create one and run these scripts to create the neccessary database and tables:

/* Create database */
CREATE DATABASE CryptoDashDatabase;
GO

/* Create tables */
CREATE TABLE Currencys (
    CurrencyName VARCHAR(50) NOT NULL PRIMARY KEY,
    Amount DECIMAL(20,10) NOT NULL
);

CREATE TABLE Transactions (
    CurrencyName VARCHAR(50) NOT NULL,
    Amount DECIMAL(20,10) NOT NULL,
    Price DECIMAL(28,20) NOT NULL,
    TransactionDate DATETIME NOT NULL PRIMARY KEY
);

Next, link your database by updating the default connection string value in the appsettings.json file under the CryptoWallet project (Web Api),
using the following format: 

"Server=<servername>,1433;Initial Catalog=<databasename>;Persist Security Info=False;User ID=<username>;Password=<password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Connection Timeout=60;"



