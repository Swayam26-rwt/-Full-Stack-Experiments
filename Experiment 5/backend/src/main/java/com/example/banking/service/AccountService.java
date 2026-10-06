package com.example.banking.service;

import com.example.banking.dto.AccountRequest;
import com.example.banking.dto.TransferRequest;
import com.example.banking.exception.BadRequestException;
import com.example.banking.exception.ResourceNotFoundException;
import com.example.banking.model.Account;
import com.example.banking.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountService {
    private final AccountRepository repository;

    public AccountService(AccountRepository repository) {
        this.repository = repository;
    }

    public List<Account> getAll() {
        return repository.findAll();
    }

    public Account getById(Long id) {
        Account account = repository.findById(id);
        if (account == null) {
            throw new ResourceNotFoundException("Account not found: " + id);
        }
        return account;
    }

    public Account create(AccountRequest request) {
        if (repository.existsByAccountNumber(request.getAccountNumber())) {
            throw new BadRequestException("Account number already exists");
        }

        Account account = new Account(
                null,
                request.getAccountNumber(),
                request.getHolderName(),
                request.getAccountType(),
                request.getBalance()
        );
        return repository.save(account);
    }

    public Account update(Long id, AccountRequest request) {
        Account account = getById(id);

        if (!account.getAccountNumber().equals(request.getAccountNumber())
                && repository.existsByAccountNumber(request.getAccountNumber())) {
            throw new BadRequestException("Account number already exists");
        }

        account.setAccountNumber(request.getAccountNumber());
        account.setHolderName(request.getHolderName());
        account.setAccountType(request.getAccountType());
        account.setBalance(request.getBalance());

        return repository.save(account);
    }

    public void delete(Long id) {
        getById(id);
        repository.deleteById(id);
    }

    public Account deposit(Long id, double amount) {
        Account account = getById(id);
        account.setBalance(account.getBalance() + amount);
        return repository.save(account);
    }

    public Account withdraw(Long id, double amount) {
        Account account = getById(id);

        if (account.getBalance() < amount) {
            throw new BadRequestException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);
        return repository.save(account);
    }

    public String transfer(TransferRequest request) {
        if (request.getFromAccountId().equals(request.getToAccountId())) {
            throw new BadRequestException("Source and destination accounts must be different");
        }

        Account from = getById(request.getFromAccountId());
        Account to = getById(request.getToAccountId());

        if (from.getBalance() < request.getAmount()) {
            throw new BadRequestException("Insufficient balance");
        }

        from.setBalance(from.getBalance() - request.getAmount());
        to.setBalance(to.getBalance() + request.getAmount());

        repository.save(from);
        repository.save(to);

        return "Transfer successful";
    }
}
