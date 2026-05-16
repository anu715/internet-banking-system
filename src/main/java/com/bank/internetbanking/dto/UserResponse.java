package com.bank.internetbanking.dto;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private double balance;
    private String accountNumber;

    public UserResponse(Long id,
                        String name,
                        String email,
                        double balance,
                        String accountNumber) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.balance = balance;
        this.accountNumber = accountNumber;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public double getBalance() {
        return balance;
    }

    public String getAccountNumber() {
        return accountNumber;
    }
}