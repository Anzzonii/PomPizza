package com.aps.PomPizza.service;

import com.aps.PomPizza.models.Pedido;
import com.aps.PomPizza.models.Pizza;
import com.aps.PomPizza.repository.PedidoRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public String addPedido(Pedido pedido){
        pedidoRepository.save(pedido);
        return "Pedido creado correctamente";
    }
}
