package com.seguros.repository;

import com.seguros.entity.Risk;
import com.seguros.entity.RiskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface RiskRepository extends JpaRepository<Risk, UUID> {

    List<Risk> findByPolicyId(UUID policyId);

    long countByPolicyIdAndStatus(UUID policyId, RiskStatus status);

    @Modifying
    @Transactional
    @Query("UPDATE Risk r SET r.status = :status WHERE r.policy.id = :policyId")
    void updateStatusByPolicyId(UUID policyId, RiskStatus status);
}