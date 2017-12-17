/*Validar horarios*/
DELIMITER -
DROP TRIGGER IF EXISTS insertar_horario;
CREATE TRIGGER insertar_horario
BEFORE INSERT
ON horario FOR EACH ROW
BEGIN
    DECLARE horas_totales integer;
    DECLARE m_catedratico integer;

    /*Evitar que las horas de clase excedan las requeridas*/
    SET horas_totales = (SELECT SUM(duracion) FROM horario WHERE seccion = NEW.seccion) + NEW.duracion;

    if (horas_totales > (
        SELECT clase.duracion FROM horario
        INNER JOIN seccion
            ON horario.seccion = seccion.id
        INNER JOIN clase
            ON seccion.clase = clase.id
        WHERE horario.seccion = NEW.seccion GROUP BY clase.id))
    THEN
        SIGNAL SQLSTATE '45010'
        SET MESSAGE_TEXT = 'Las horas de esta sección exeden las horas semanales máximas';
    END IF;

    /*Conflictos con los horarios de los catedraticos*/
    SET m_catedratico = (SELECT catedratico FROM seccion WHERE id = NEW.seccion);

    if (SELECT COUNT(horario.id) FROM horario
        INNER JOIN seccion
        ON horario.seccion = seccion.id
        WHERE seccion.catedratico = m_catedratico
        AND horario.dia = NEW.dia
        AND horario.inicio < (NEW.inicio + NEW.duracion)
        AND (horario.inicio + horario.duracion) > NEW.inicio) > 0
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El horario del catedrático tiene conflicto';
    END IF;

    /*Conflictos con los horarios de las aulas*/
    if (SELECT COUNT(horario.id) FROM horario
        WHERE horario.aula = NEW.aula
        AND horario.dia = NEW.dia
        AND horario.inicio < (NEW.inicio + NEW.duracion)
        AND (horario.inicio + horario.duracion) > NEW.inicio) > 0
    THEN
        SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'El horario del aula tiene conflicto';
    END IF;
END; -
DELIMITER ;

DELIMITER -
DROP TRIGGER IF EXISTS modificar_horario;
CREATE TRIGGER modificar_horario
BEFORE UPDATE
ON horario FOR EACH ROW
BEGIN
    DECLARE horas_totales integer;
    DECLARE m_catedratico integer;

    /*Evitar que las horas totales excedan las horas requeridas*/
    SET horas_totales = (SELECT SUM(duracion) FROM horario WHERE seccion = NEW.seccion AND id != NEW.id) + NEW.duracion;

    if (horas_totales > (
        SELECT clase.duracion FROM horario
        INNER JOIN seccion
            ON horario.seccion = seccion.id
        INNER JOIN clase
            ON seccion.clase = clase.id
        WHERE horario.seccion = NEW.seccion 
        AND horario.id != NEW.id
        GROUP BY clase.id))
    THEN
        SIGNAL SQLSTATE '45010'
        SET MESSAGE_TEXT = 'Las horas de esta sección exeden las horas semanales máximas';
    END IF;

    SET m_catedratico = (SELECT catedratico FROM seccion WHERE id = NEW.seccion);

    /*Conflictos con los horarios de los catedraticos*/
    if (SELECT COUNT(horario.id) FROM horario
        INNER JOIN seccion
        ON horario.seccion = seccion.id
        WHERE horario.id != NEW.id
        AND seccion.catedratico = m_catedratico
        AND horario.dia = NEW.dia
        AND horario.inicio < (NEW.inicio + NEW.duracion)
        AND (horario.inicio + horario.duracion) > NEW.inicio) > 0
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El horario del catedrático tiene conflicto';
    END IF;

    /*Conflictos con los horarios de las aulas*/
    if (SELECT COUNT(horario.id) FROM horario
        WHERE horario.id != NEW.id
        AND horario.aula = NEW.aula
        AND horario.dia = NEW.dia
        AND horario.inicio < (NEW.inicio + NEW.duracion)
        AND (horario.inicio + horario.duracion) > NEW.inicio) > 0
    THEN
        SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'El horario del aula tiene conflicto';
    END IF;
END; -
DELIMITER ;

DELIMITER -
/*Validar secciones*/
DROP TRIGGER IF EXISTS modificar_seccion;
CREATE TRIGGER modificar_seccion
BEFORE UPDATE
ON seccion FOR EACH ROW
BEGIN
    DECLARE colisiones integer;

    CREATE TEMPORARY TABLE horario_seccion_actual
    SELECT * FROM horario WHERE seccion = NEW.id;
    CREATE TEMPORARY TABLE horario_catedratico
    SELECT horario.* FROM horario
    INNER JOIN seccion
    ON horario.seccion = seccion.id
    WHERE seccion.catedratico = NEW.catedratico;

    SELECT COUNT(horario_seccion_actual.id)
    FROM horario_seccion_actual
    INNER JOIN horario_catedratico
    ON horario_seccion_actual.id != horario_catedratico.id
    AND horario_seccion_actual.dia = horario_catedratico.dia
    AND horario_seccion_actual.inicio < (horario_catedratico.inicio + horario_catedratico.duracion)
    AND (horario_seccion_actual.inicio + horario_seccion_actual.duracion) > horario_catedratico.inicio
    INTO colisiones;

    DROP TEMPORARY TABLE horario_seccion_actual;
    DROP TEMPORARY TABLE horario_catedratico;

    if colisiones > 0
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El horario del catedrático tiene conflicto';
    END IF;
END; -
DELIMITER ;

DELIMITER -
DROP PROCEDURE IF EXISTS insertar_registro;
CREATE PROCEDURE insertar_registro(_seccion INT, _aula INT, hora INT)
BEGIN
    DECLARE reg integer;
    SET reg = (SELECT id FROM registro WHERE seccion = _seccion AND salida is NULL LIMIT 1);

    IF (reg is NULL)
    THEN
        INSERT INTO registro(seccion, aula, entrada) VALUE
        (_seccion, _aula, hora);
    ELSE
        UPDATE registro SET salida = hora WHERE id = reg;
    END IF;
END; -
DELIMITER ;

CALL insertar_registro(26, 1, 28800);
