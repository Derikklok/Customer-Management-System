package org.example.repository;

import org.example.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByNicNumber(String nicNumber);

    boolean existsByNicNumber(String nicNumber);

    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.addresses a LEFT JOIN FETCH a.city LEFT JOIN FETCH a.country WHERE c.id = :id")
    Optional<Customer> findByIdWithAddresses(@Param("id") Long id);

    List<Customer> findByNicNumberIn(List<String> nicNumbers);

    @Query("SELECT c FROM Customer c LEFT JOIN FETCH c.addresses a LEFT JOIN FETCH a.city LEFT JOIN FETCH a.country WHERE c.id IN :ids")
    List<Customer> findByIdsWithAddresses(@Param("ids") List<Long> ids);

    @Query("SELECT DISTINCT c FROM Customer c LEFT JOIN FETCH c.mobileNumbers WHERE c IN :customers")
    List<Customer> fetchMobileNumbers(@Param("customers") List<Customer> customers);

    @Query("SELECT DISTINCT c FROM Customer c LEFT JOIN FETCH c.familyMembers WHERE c IN :customers")
    List<Customer> fetchFamilyMembers(@Param("customers") List<Customer> customers);
}