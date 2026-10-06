package com.example.banking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class AccountRequest {
    @NotBlank(message = "Account number is required")
    @Pattern(regexp = "\\d{10}", message = "Account number must contain exactly 10 digits")
    private String accountNumber;

    @NotBlank(message = "Holder name is required")
    @Size(min = 2, max = 50, message = "Holder name must be between 2 and 50 characters")
    private String holderName;

    @NotBlank(message = "Account type is required")
    @Pattern(regexp = "SAVINGS|CURRENT", message = "Account type must be SAVINGS or CURRENT")
    private String accountType;

    @PositiveOrZero(message = "Balance cannot be negative")
    private double balance;

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getHolderName() { return holderName; }
    public void setHolderName(String holderName) { this.holderName = holderName; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }
}
