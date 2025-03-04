package com.aps.PomPizza.repository;

import com.aps.PomPizza.models.Pedido;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PedidoRepository extends MongoRepository<Pedido, String> {
}
