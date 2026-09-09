package com.seguros.repository;

import com.seguros.entity.Policy;
import com.seguros.entity.PolicyStatus;
import com.seguros.entity.PolicyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PolicyRepository extends JpaRepository<Policy, UUID> {
    List<Policy> findByTypeAndStatus(PolicyType type, PolicyStatus status);
    List<Policy> findByStatus(PolicyStatus status);
}