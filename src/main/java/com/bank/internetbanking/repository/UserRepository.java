package com.bank.internetbanking.repository;

import com.bank.internetbanking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
    User findByAccountNumber(String accountNumber);
}
