#!/bin/bash

case "$1" in
    start)
        echo "🚀 Iniciando SmythOS SRE Enhanced..."
        cd /root/sre-espanol/api-example
        nohup node server-enhanced.js > /root/logs/sre-enhanced.log 2>&1 &
        echo $! > /root/sre-enhanced.pid
        echo "✅ SRE Enhanced iniciado"
        ;;
    stop)
        echo "🛑 Deteniendo SmythOS SRE Enhanced..."
        if [ -f /root/sre-enhanced.pid ]; then
            kill $(cat /root/sre-enhanced.pid) 2>/dev/null || true
            rm -f /root/sre-enhanced.pid
        fi
        pkill -f "node server-enhanced.js" || true
        echo "✅ SRE Enhanced detenido"
        ;;
    restart)
        $0 stop
        sleep 3
        $0 start
        ;;
    status)
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/estado | grep -q "200"; then
            echo "✅ SmythOS SRE Enhanced está funcionando"
            curl -s http://localhost:8000/api/estado | jq .
        else
            echo "❌ SmythOS SRE Enhanced no responde"
        fi
        ;;
    providers)
        echo "🤖 Proveedores de IA disponibles:"
        curl -s http://localhost:8000/api/proveedores | jq '.datos[] | {id: .id, name: .name, models: .models | length}'
        ;;
    models)
        echo "🧠 Modelos disponibles:"
        curl -s http://localhost:8000/api/modelos | jq '.datos[] | {provider: .providerName, model: .model}'
        ;;
    test)
        echo "🧪 Probando conectividad de proveedores..."
        curl -s -X POST http://localhost:8000/api/proveedores/test | jq .
        ;;
    logs)
        tail -f /root/logs/sre-enhanced.log
        ;;
    *)
        echo "Uso: $0 {start|stop|restart|status|providers|models|test|logs}"
        exit 1
        ;;
esac
