package com.bank.internetbanking.controller;

import com.bank.internetbanking.entity.Transaction;
import com.bank.internetbanking.entity.User;
import com.bank.internetbanking.service.UserService;
import org.springframework.web.bind.annotation.*;
import com.bank.internetbanking.dto.LoginRequest;
import com.bank.internetbanking.dto.RegisterRequest;
import com.bank.internetbanking.dto.UserResponse;
import com.bank.internetbanking.dto.LoginResponse;
import com.bank.internetbanking.entity.AuditLog;


import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://internet-banking-system-pi.vercel.app")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return userService.register(user);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        String token = userService.login(user);

        return new LoginResponse(token);
    }

    @GetMapping("/user/{email}")
    public UserResponse getUser(@PathVariable String email) {

        User user = userService.getUser(email);

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBalance(),
                user.getAccountNumber()
        );
    }

    @PostMapping("/deposit/{email}/{amount}")
    public User deposit(@PathVariable String email,
                        @PathVariable double amount) {

        return userService.deposit(email, amount);
    }

    @PostMapping("/withdraw/{email}/{amount}")
    public User withdraw(@PathVariable String email,
                         @PathVariable double amount) {

        return userService.withdraw(email, amount);
    }

    @PostMapping("/transfer")
    public String transfer(@RequestParam String senderEmail,
                           @RequestParam String receiverAccountNumber,
                           @RequestParam double amount) {

        return userService.transfer(
                senderEmail,
                receiverAccountNumber,
                amount
        );
    }

    @GetMapping("/transactions/{userId}")
    public List<Transaction> getTransactions(
            @PathVariable Long userId) {

        return userService.getTransactions(userId);
    }
    @GetMapping("/transactions")
    public List<Transaction> getAllTransactions() {
        return userService.getAllTransactions();
    }
    @GetMapping("/audit-logs")
    public List<AuditLog> getAuditLogs() {
        return userService.getAuditLogs();
    }
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }



    @PostMapping("/freeze/{userId}")
    public String freezeAccount(@PathVariable Long userId) {
        return userService.freezeAccount(userId);
    }

    @PostMapping("/unfreeze/{userId}")
    public String unfreezeAccount(@PathVariable Long userId) {
        return userService.unfreezeAccount(userId);
    }

    @GetMapping("/test")
    public String test() {
        return "API working";
    }
}