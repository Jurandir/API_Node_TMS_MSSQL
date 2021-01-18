INSERT INTO SIC.dbo.SCCD_APP (TIPO, DOCUMENTO, DT_UPLOAD, MOTORISTA, PLACAS, OBS, OPERACAO, TIPOVEICULO, ARQUIVO, IMAGEM_ID, USUARIO,
            MATRICULA )
   VALUES (
           '${v_db.TIPO}',
           '${v_db.DOCUMENTO}',
           '${v_db.DT_UPLOAD}',
           '${v_db.MOTORISTA}',
           '${v_db.PLACAS}',
           '${v_db.OBS}',
           '${v_db.OPERACAO}',
           '${v_db.TIPOVEICULO}',
           '${v_db.ARQUIVO}',
           '${v_db.IMAGEM_ID}',
           '${v_db.USUARIO}',
           '${v_db.MATRICULA}'
		   )
