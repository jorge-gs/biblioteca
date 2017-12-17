<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');

    if (isset($_GET['clase_carrera'])) {
        $consulta = $db->prepare('SELECT * FROM requisito WHERE clase_carrera = ?');
        $consulta->bind_param('i', $_GET['clase_carrera']);
        $consulta->execute();
        $res = $consulta->get_result();

        $lista = array();
        foreach ($res as $fila) {
            $lista[] = $fila;
        }

        header('Content-type: application/json');
        echo json_encode($lista);

        $consulta->close();
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM requisito');

        $lista = array();
        foreach ($res as $fila) {
            $lista[] = $fila;
        }

        header('Content-type: application/json');
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['clase_carrera'] = $_POST['clase_carrera'];
        $fila['clase'] = $_POST['clase'];

        $consulta = $db->prepare('INSERT INTO requisito(clase_carrera, clase) VALUES (?, ?)');
        $consulta->bind_param('ii', $fila['clase_carrera'], $fila['clase']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
        }
        $consulta->close();

        echo true;
    } else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        parse_str(file_get_contents('php://input'), $_DELETE);
        
        $consulta = $db->prepare('DELETE FROM requisito WHERE clase_carrera = ? AND clase = ?');
        $consulta->bind_param('ii', $_DELETE['clase_carrera'], $_DELETE['clase']);
        if(!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
        }
        $consulta->close();

        echo true;
    }

    $db->close();
?>