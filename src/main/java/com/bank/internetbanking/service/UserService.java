package com.bank.internetbanking.service;

import com.bank.internetbanking.entity.Transaction;
import com.bank.internetbanking.entity.User;
import com.bank.internetbanking.repository.TransactionRepository;
import com.bank.internetbanking.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.bank.internetbanking.security.JwtService;
import com.bank.internetbanking.entity.AuditLog;
import com.bank.internetbanking.repository.AuditLogRepository;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class UserService {

    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuditLogRepository auditLogRepository;

    public UserService(UserRepository userRepository,
                       TransactionRepository transactionRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;

        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String register(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return "Email already exists";
        }

        user.setBalance(0.0);
        user.setRole("USER");
        user.setAccountStatus("ACTIVE");

        user.setAccountNumber(
                "ACC" + System.currentTimeMillis()
        );
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
        saveAuditLog(
                "REGISTER",
                user.getEmail(),
                "New user registered"
        );

        return "Registration successful";
    }

    public String login(User loginUser) {
        User user = userRepository.findByEmail(loginUser.getEmail());

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.getAccountStatus().equals("ACTIVE")) {
            throw new RuntimeException("Account is frozen. Contact admin.");
        }

        if (passwordEncoder.matches(loginUser.getPassword(), user.getPassword())) {

            saveAuditLog(
                    "LOGIN",
                    user.getEmail(),
                    "User logged in"
            );

            return jwtService.generateToken(
                    user.getEmail(),
                    user.getRole()
            );
        }

        return "Invalid credentials";
    }

    public User getUser(String email) {
        return userRepository.findByEmail(email);
    }

    public User deposit(String email, double amount) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }
        if (!user.getAccountStatus().equals("ACTIVE")) {
            throw new RuntimeException("Account is frozen");
        }

        if (amount <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        user.setBalance(user.getBalance() + amount);
        userRepository.save(user);

        saveTransaction(user.getId(), user.getId(), amount, "DEPOSIT");

        return user;
    }

    public User withdraw(String email, double amount) {
        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (!user.getAccountStatus().equals("ACTIVE")) {
            throw new RuntimeException("Account is frozen");
        }

        if (amount <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        if (user.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);

        saveTransaction(user.getId(), user.getId(), amount, "WITHDRAW");

        return user;
    }

    public String transfer(String senderEmail,
                           String receiverAccountNumber,
                           double amount) {

        User sender = userRepository.findByEmail(senderEmail);

        User receiver = userRepository.findByAccountNumber(
                receiverAccountNumber
        );

        if (sender == null || receiver == null) {
            throw new RuntimeException("User not found");
        }
        if (!sender.getAccountStatus().equals("ACTIVE")) {
            throw new RuntimeException("Sender account is frozen");
        }

        if (amount <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        if (sender.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        sender.setBalance(sender.getBalance() - amount);
        receiver.setBalance(receiver.getBalance() + amount);

        userRepository.save(sender);
        userRepository.save(receiver);

        saveTransaction(
                sender.getId(),
                receiver.getId(),
                amount,
                "TRANSFER"
        );

        return "Transfer success";
    }


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Transaction> getTransactions(Long userId) {
        return transactionRepository
                .findBySenderIdOrReceiverIdOrderByTimeDesc(userId, userId);
    }
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAll();
    }

    public String freezeAccount(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountStatus("FROZEN");

        userRepository.save(user);

        return "Account frozen successfully";
    }
    public String unfreezeAccount(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountStatus("ACTIVE");

        userRepository.save(user);
        saveAuditLog(
                "REGISTER",
                user.getEmail(),
                "New user registered"
        );

        return "Account unfrozen successfully";
    }
    private void saveAuditLog(String action, String email, String details) {

        AuditLog auditLog = new AuditLog();

        auditLog.setAction(action);
        auditLog.setEmail(email);
        auditLog.setDetails(details);
        auditLog.setTime(LocalDateTime.now());

        auditLogRepository.save(auditLog);
    }

    private void saveTransaction(Long senderId,
                                 Long receiverId,
                                 double amount,
                                 String type) {

        Transaction transaction = new Transaction();

        transaction.setSenderId(senderId);
        transaction.setReceiverId(receiverId);
        transaction.setAmount(amount);
        transaction.setType(type);
        transaction.setTime(LocalDateTime.now());

        transactionRepository.save(transaction);
    }
}