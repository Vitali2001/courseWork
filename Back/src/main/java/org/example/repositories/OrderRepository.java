package org.example.repositories;


import org.example.entity.OrderEntity;
import org.springframework.core.Ordered;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity,Integer> {
    OrderEntity findById(int id);
}
