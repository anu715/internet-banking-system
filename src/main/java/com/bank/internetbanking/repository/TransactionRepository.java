package com.bank.internetbanking.repository;

import com.bank.internetbanking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderIdOrReceiverId(Long senderId, Long receiverId);

    List<Transaction> findBySenderIdOrReceiverIdOrderByTimeDesc(Long senderId, Long receiverId);
}