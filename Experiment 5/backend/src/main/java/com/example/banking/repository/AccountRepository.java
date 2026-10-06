package com.example.banking.repository;

import com.example.banking.model.Account;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class AccountRepository {
    private final Map<Long, Account> accounts = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(0);

    public List<Account> findAll() {
        return new ArrayList<>(accounts.values());
    }

    public Account findById(Long id) {
        return accounts.get(id);
    }

    public Account save(Account account) {
        if (account.getId() == null) {
            account.setId(idGenerator.incrementAndGet());
        }
        accounts.put(account.getId(), account);
        return account;
    }

    public void deleteById(Long id) {
        accounts.remove(id);
    }

    public boolean existsByAccountNumber(String accountNumber) {
        return accounts.values().stream()
                .anyMatch(a -> a.getAccountNumber().equals(accountNumber));
    }
}
