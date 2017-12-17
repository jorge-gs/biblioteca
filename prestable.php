<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');

    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM prestable WHERE id = ?');
        $consulta->bind_param('i', $_GET['id']);
        $consulta->execute();
        $res = $consulta->get_result();
        
        $fila = $res->fetch_assoc();
        $consulta->close();
        $res2 = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $fila['categoria'])->fetch_assoc();
        $fila['categoria'] = $res2;
        
        header('Content-Type: application/json');
        echo json_encode($fila);
    } else if (isset($_GET['aulas'])) {
        $res = $db->query('SELECT * FROM prestable WHERE categoria = 1 OR categoria = 2 ORDER BY categoria, nombre');

        $lista = array();
        foreach ($res as $fila) {
            $res2 = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $fila['categoria'])->fetch_assoc();
            $fila['categoria'] = $res2;
            $lista[] = $fila;
        }
        
        header('Content-Type: application/json');
        echo json_encode($lista);
    } else if  ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM prestable ORDER BY categoria, nombre');

        $lista = array();
        foreach($res as $fila) {
            $res2 = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $fila['categoria'])->fetch_assoc();
            $fila['categoria'] = $res2;
            $lista[] = $fila;
        }

        header('Content-Type: application/json');
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['categoria'] = $_POST['categoria'];
        $fila['nombre'] = $_POST['nombre'];

        $consulta = $db->prepare('INSERT INTO prestable(categoria, nombre) VALUES (?, ?)');
        $consulta->bind_param('is', $fila['categoria'], $fila['nombre']);
        if(!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $consulta->close();

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        parse_str(file_get_contents('php://input'), $_PUT);

        $fila['id'] = $_PUT['id'];
        $fila['categoria'] = $_PUT['categoria'];
        $fila['nombre'] = $_PUT['nombre'];

        if ($fila['categoria']) {
            $consulta = $db->prepare('UPDATE prestable SET categoria = ? WHERE id = ?');
            $consulta->bind_param('ii', $fila['categoria'], $fila['id']);
            $consulta->execute();
            $consulta->close();
        }
        if ($fila['nombre']) {
            $consulta = $db->prepare('UPDATE prestable SET nombre = ? WHERE id = ?');
            $consulta->bind_param('si', $fila['nombre'], $fila['id']);
            if(!$consulta->execute()) {
                echo json_encode(mysqli_stmt_error_list($consulta));
                exit();
            }
            $consulta->close();
        }

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);

        $consulta = $db->prepare('DELETE FROM prestable WHERE id = ?');
        $consulta->bind_param('i', $_DELETE['id']);
        $consulta->execute();
    }
?>