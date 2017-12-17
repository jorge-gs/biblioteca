<?php
    $db = new mysqli('localhost:3306', 'root', 'password', 'biblioteca');
    $db->set_charset('utf8');
    header('Content-type: application/json');

    if (isset($_GET['id'])) {
        $consulta = $db->prepare('SELECT * FROM registro WHERE id = ? ORDER BY seccon');
        $consulta->bind_param('i', $_GET['id']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $res = $consulta->get_result();
        $seccion = $db->query('SELECT * FROM seccion WHERE id = ' . $res['seccion'])->fetch_assoc();
        $seccion['clase'] = $db->query('SELECT * FROM clase WHERE id = ' . $seccion['clase'])->fetch_assoc();
        $seccion['catedratico'] = $db->query('SELECT * FROM persona WHERE id = ' . $seccion['catedratico'])->fetch_assoc();
        $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $res['aula'])->fetch_assoc();
        $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
        $res['seccion'] = $seccion;
        $res['aula'] = $aula;

        echo json_encode($lista);
        $consulta->close();
    } else if (isset($_GET['catedratico'])) {
        $consulta = $db->prepare('SELECT registro.* FROM registro INNER JOIN seccion ON registro.seccion = seccion.id WHERE seccion.catedratico = ? ORDER BY registro.seccion');
        $consulta->bind_param('i', $_GET['catedratico']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $res = $consulta->get_result();

        $lista = array();
        foreach ($res as $fila) {
            $seccion = $db->query('SELECT * FROM seccion WHERE id = ' . $fila['seccion'])->fetch_assoc();
            $seccion['clase'] = $db->query('SELECT * FROM clase WHERE id = ' . $seccion['clase'])->fetch_assoc();
            $seccion['catedratico'] = $db->query('SELECT * FROM persona WHERE id = ' . $seccion['catedratico'])->fetch_assoc();
            $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $fila['aula'])->fetch_assoc();
            $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
            $fila['seccion'] = $seccion;
            $fila['aula'] = $aula;
            $lista[] = $fila;
        }

        echo json_encode($lista);
        $consulta->close();
    } else if (isset($_GET['seccion'])) {
        $consulta = $db->prepare('SELECT * FROM registro WHERE seccion = ? ORDER BY seccion');
        $consulta->bind_param('i', $_GET['seccion']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }
        $res = $consulta->get_result();
        
        $lista = array();
        foreach ($res as $fila) {
            $seccion = $db->query('SELECT * FROM seccion WHERE id = ' . $fila['seccion'])->fetch_assoc();
            $seccion['clase'] = $db->query('SELECT * FROM clase WHERE id = ' . $seccion['clase'])->fetch_assoc();
            $seccion['catedratico'] = $db->query('SELECT * FROM persona WHERE id = ' . $seccion['catedratico'])->fetch_assoc();
            $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $fila['aula'])->fetch_assoc();
            $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
            $fila['seccion'] = $seccion;
            $fila['aula'] = $aula;
            $lista[] = $fila;
        }

        echo json_encode($lista);
        $consulta->close();
    } else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $res = $db->query('SELECT * FROM registro');
        if (!$res) {
            echo json_encode(mysqli_error_list($db));
            exit();
        }

        $lista = array();
        foreach ($res as $fila) {
            $seccion = $db->query('SELECT * FROM seccion WHERE id = ' . $fila['seccion'])->fetch_assoc();
            $seccion['clase'] = $db->query('SELECT * FROM clase WHERE id = ' . $seccion['clase'])->fetch_assoc();
            $seccion['catedratico'] = $db->query('SELECT * FROM persona WHERE id = ' . $seccion['catedratico'])->fetch_assoc();
            $aula = $db->query('SELECT * FROM prestable WHERE id = ' . $fila['aula'])->fetch_assoc();
            $aula['categoria'] = $db->query('SELECT * FROM categoria_prestable WHERE id = ' . $aula['categoria'])->fetch_assoc();
            $fila['seccion'] = $seccion;
            $fila['aula'] = $aula;
            $lista[] = $fila;
        }
        
        echo json_encode($lista);
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $fila['seccion'] = $_POST['seccion'];
        $fila['aula'] = $_POST['aula'];
        $fila['hora'] = $_POST['hora'];

        $consulta = $db->prepare('CALL insertar_registro(?, ?, ?)');
        $consulta->bind_param('iii', $fila['seccion'], $fila['aula'], $fila['hora']);
        if (!$consulta->execute()) {
            echo json_encode(mysqli_stmt_error_list($consulta));
            exit();
        }
        $consulta->close();

        echo true;
    }

    $db->close();
?>