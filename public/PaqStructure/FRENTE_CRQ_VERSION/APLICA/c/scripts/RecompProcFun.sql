prompt Script : Recompilar Funciones y Procedimientos
declare
    sbout varchar2(1000);
    nuerr number;
    CURSOR cuProcInv IS
     SELECT   o.owner, o.object_name, o.object_type
        FROM all_objects o
        WHERE o.object_type in ('FUNCTION', 'PROCEDURE', 'TRIGGER')
        AND o.status = 'INVALID'
        AND o.owner ='FLEX';


BEGIN
   for rc in cuProcInv loop
    BEGIN
      execute immediate 'ALTER '||rc.object_type||' '|| rc.owner || '.' || rc.object_name || ' COMPILE';
    EXCEPTION
      WHEN OTHERS THEN
        DBMS_OUTPUT.put_line(rc.object_type || ' : ' || rc.owner ||
                             '.' || rc.object_name||' - '||SubStr(sqlerrm, 1, 200));
    END;
   END loop;
EXCEPTION
    when ex.CONTROLLED_ERROR then
        Errors.GetError(nuerr, sbout);
        dbms_output.put_Line(nuerr||'-'||sbout);
    when others then
        Errors.setError;
        Errors.GetError(nuerr, sbout);
        dbms_output.put_Line(nuerr||'-'||sbout);
END;
/
exit