package com.aps.PomPizza.controller.RestController;

import com.aps.PomPizza.models.Pedido;
import com.aps.PomPizza.repository.PedidoRepository;
import com.aps.PomPizza.service.PedidoService;
import com.aps.PomPizza.service.PizzaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoRestController {

    @Autowired
    PedidoService pedidoService;

    private PedidoRepository pedidoRepository;

    public PedidoRestController(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    @PostMapping("/addNewPedido")
    public String addNewPedido(@RequestBody Pedido pedido){
        return pedidoService.addPedido(pedido);
    }

    @GetMapping()
    public List<Pedido> allPedidos() {
        return pedidoRepository.findAll();
    }

    @PutMapping("/editarPedido/{id}")
    public String editPedido(@PathVariable String id, @RequestBody Map<String, String> body){

        Optional<Pedido> pedido = pedidoRepository.findById(id);

        if(pedido.isPresent()){
            String nuevoEstado = body.get("estado");
            pedido.get().setEstado(nuevoEstado);
            pedidoRepository.save(pedido.get());

        }
            return "pedidos";

    }
}
