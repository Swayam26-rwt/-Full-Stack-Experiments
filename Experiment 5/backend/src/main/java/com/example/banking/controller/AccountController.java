package com.example.banking.controller;

import com.example.banking.dto.AccountRequest;
import com.example.banking.dto.ApiResponse;
import com.example.banking.dto.TransactionRequest;
import com.example.banking.dto.TransferRequest;
import com.example.banking.model.Account;
import com.example.banking.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:5173")
public class AccountController {
    private final AccountService service;

    public AccountController(AccountService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> getAll() {
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Accounts fetched", service.getAll())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Account>> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Account fetched", service.getById(id))
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Account>> create(
            @Valid @RequestBody AccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                new ApiResponse<>("success", "Account created", service.create(request))
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Account>> update(
            @PathVariable Long id,
            @Valid @RequestBody AccountRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Account updated", service.update(id, request))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Account deleted", null)
        );
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<ApiResponse<Account>> deposit(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Deposit successful",
                        service.deposit(id, request.getAmount()))
        );
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<Account>> withdraw(
            @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>("success", "Withdrawal successful",
                        service.withdraw(id, request.getAmount()))
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<String>> transfer(
            @Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(
                new ApiResponse<>("success", service.transfer(request), null)
        );
    }
}
