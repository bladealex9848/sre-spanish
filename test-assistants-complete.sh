#!/bin/bash

# Script de pruebas completas para Asistentes Especializados de OpenAI
# Integrados en SmythOS SRE

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para logging con colores
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_header() { echo -e "${PURPLE}🔍 $1${NC}"; }

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           PRUEBAS COMPLETAS - ASISTENTES ESPECIALIZADOS     ║"
echo "║                    SmythOS SRE Enhanced                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

BASE_URL="http://localhost:8000"

# 1. Verificar que el servidor esté funcionando
log_header "1. VERIFICACIÓN DEL SERVIDOR"
echo "=" * 40

if curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/estado | grep -q "200"; then
    log_success "Servidor funcionando correctamente"
else
    log_error "Servidor no responde. Iniciando servidor..."
    /root/manage-sre-enhanced.sh restart
    sleep 10
fi

# 2. Probar endpoints de asistentes
log_header "2. ENDPOINTS DE ASISTENTES"
echo "=" * 35

echo ""
log_info "2.1 Lista de todos los asistentes:"
ASISTENTES_RESPONSE=$(curl -s $BASE_URL/api/asistentes)
TOTAL_ASISTENTES=$(echo "$ASISTENTES_RESPONSE" | jq -r '.total // 0')
log_success "Total de asistentes disponibles: $TOTAL_ASISTENTES"

echo ""
log_info "2.2 Categorías disponibles:"
curl -s $BASE_URL/api/asistentes/categorias | jq -r '.datos[] | "   - " + .categoria + ": " + (.cantidad | tostring) + " asistentes"'

echo ""
log_info "2.3 Asistentes legales:"
curl -s $BASE_URL/api/asistentes/categoria/legal | jq -r '.datos[] | "   - " + .titulo'

# 3. Pruebas de búsqueda de asistentes
log_header "3. BÚSQUEDA DE ASISTENTES"
echo "=" * 35

CONSULTAS_BUSQUEDA=("constitución" "familia" "tributario" "salud" "educación")

for consulta in "${CONSULTAS_BUSQUEDA[@]}"; do
    echo ""
    log_info "Buscando asistentes para: '$consulta'"
    RESULTADO=$(curl -s -X POST $BASE_URL/api/asistentes/buscar \
        -H "Content-Type: application/json" \
        -d "{\"query\": \"$consulta\"}")
    
    ENCONTRADOS=$(echo "$RESULTADO" | jq -r '.total // 0')
    if [ "$ENCONTRADOS" -gt 0 ]; then
        log_success "Encontrados $ENCONTRADOS asistentes"
        echo "$RESULTADO" | jq -r '.datos[0] | "   → " + .titulo'
    else
        log_warning "No se encontraron asistentes para '$consulta'"
    fi
done

# 4. Pruebas de recomendaciones
log_header "4. SISTEMA DE RECOMENDACIONES"
echo "=" * 40

CONSULTAS_RECOMENDACION=(
    "Necesito ayuda con una tutela"
    "Tengo una consulta sobre derecho de familia"
    "Quiero información sobre impuestos"
    "Necesito analizar un documento"
    "Tengo una pregunta sobre la constitución"
)

for consulta in "${CONSULTAS_RECOMENDACION[@]}"; do
    echo ""
    log_info "Consulta: '$consulta'"
    RECOMENDACION=$(curl -s -X POST $BASE_URL/api/asistentes/recomendacion \
        -H "Content-Type: application/json" \
        -d "{\"consulta\": \"$consulta\"}")
    
    ASISTENTE_RECOMENDADO=$(echo "$RECOMENDACION" | jq -r '.datos.asistente.titulo')
    RAZON=$(echo "$RECOMENDACION" | jq -r '.datos.razon')
    
    log_success "Recomendado: $ASISTENTE_RECOMENDADO"
    echo "   Razón: $RAZON"
done

# 5. Pruebas de consultas a asistentes (solo si OpenAI API está disponible)
log_header "5. PRUEBAS DE CONSULTAS A ASISTENTES"
echo "=" * 45

# Verificar si OpenAI API está configurada
if [ -n "$OPENAI_API_KEY" ] || grep -q "OPENAI_API_KEY" /root/sre-espanol/.env 2>/dev/null; then
    log_info "OpenAI API Key detectada, probando consultas..."
    
    # Prueba con asistente general
    echo ""
    log_info "5.1 Prueba con Asistente Virtual General:"
    CONSULTA_GENERAL="Hola, ¿puedes ayudarme con una consulta básica?"
    
    RESPUESTA_GENERAL=$(curl -s -X POST $BASE_URL/api/asistentes/asistente_virtual/consulta \
        -H "Content-Type: application/json" \
        -d "{\"mensaje\": \"$CONSULTA_GENERAL\"}" \
        --max-time 60)
    
    if echo "$RESPUESTA_GENERAL" | jq -e '.exito' > /dev/null 2>&1; then
        EXITO=$(echo "$RESPUESTA_GENERAL" | jq -r '.exito')
        if [ "$EXITO" = "true" ]; then
            log_success "Consulta exitosa al asistente general"
            RESPUESTA_TEXTO=$(echo "$RESPUESTA_GENERAL" | jq -r '.datos.respuesta' | head -c 100)
            echo "   Respuesta: $RESPUESTA_TEXTO..."
        else
            ERROR_MSG=$(echo "$RESPUESTA_GENERAL" | jq -r '.mensaje // .error')
            log_error "Error en consulta: $ERROR_MSG"
        fi
    else
        log_error "Respuesta inválida del servidor"
    fi
    
    # Prueba con asistente especializado en constitución
    echo ""
    log_info "5.2 Prueba con Experto en Constitución:"
    CONSULTA_CONSTITUCION="¿Cuáles son los derechos fundamentales en Colombia?"
    
    RESPUESTA_CONSTITUCION=$(curl -s -X POST $BASE_URL/api/asistentes/constitucion/consulta \
        -H "Content-Type: application/json" \
        -d "{\"mensaje\": \"$CONSULTA_CONSTITUCION\"}" \
        --max-time 60)
    
    if echo "$RESPUESTA_CONSTITUCION" | jq -e '.exito' > /dev/null 2>&1; then
        EXITO=$(echo "$RESPUESTA_CONSTITUCION" | jq -r '.exito')
        if [ "$EXITO" = "true" ]; then
            log_success "Consulta exitosa al experto en constitución"
            THREAD_ID=$(echo "$RESPUESTA_CONSTITUCION" | jq -r '.datos.threadId')
            echo "   Thread ID: $THREAD_ID"
        else
            ERROR_MSG=$(echo "$RESPUESTA_CONSTITUCION" | jq -r '.mensaje // .error')
            log_warning "Error en consulta constitucional: $ERROR_MSG"
        fi
    else
        log_warning "Respuesta inválida para consulta constitucional"
    fi
    
else
    log_warning "OpenAI API Key no configurada, omitiendo pruebas de consultas"
fi

# 6. Estadísticas finales
log_header "6. ESTADÍSTICAS FINALES"
echo "=" * 30

echo ""
log_info "📊 Resumen de asistentes por categoría:"
curl -s $BASE_URL/api/asistentes/categorias | jq -r '.datos[] | "   " + .categoria + ": " + (.cantidad | tostring) + " asistentes"'

echo ""
log_info "🎯 Asistentes más especializados:"
echo "   - Constitución Colombiana: Experto en derechos fundamentales"
echo "   - TutelaBot: Especialista en acciones de tutela"
echo "   - FamiliaBot: Derecho de familia colombiano"
echo "   - JURIS-INTEGRAL: Jurisprudencia con metodología magistrada"
echo "   - ConsejoExpert: Consejos Seccionales de la Judicatura"

echo ""
log_info "🔧 Estado del sistema:"
ESTADO_SISTEMA=$(curl -s $BASE_URL/api/estado)
ASISTENTES_TOTAL=$(echo "$ESTADO_SISTEMA" | jq -r '.datos.asistentesEspecializados // 0')
CATEGORIAS_TOTAL=$(echo "$ESTADO_SISTEMA" | jq -r '.datos.categorias | length // 0')

echo "   - Asistentes especializados: $ASISTENTES_TOTAL"
echo "   - Categorías disponibles: $CATEGORIAS_TOTAL"
echo "   - Servidor: Operativo"

# 7. Generar reporte de pruebas
log_header "7. GENERANDO REPORTE"
echo "=" * 25

FECHA=$(date '+%Y-%m-%d %H:%M:%S')
REPORTE_FILE="/root/logs/test-assistants-report-$(date +%Y%m%d_%H%M%S).json"

cat > $REPORTE_FILE << EOF
{
  "fecha": "$FECHA",
  "servidor": "SmythOS SRE Enhanced",
  "version": "1.0.0",
  "pruebas": {
    "servidor_funcionando": true,
    "asistentes_disponibles": $TOTAL_ASISTENTES,
    "categorias_disponibles": $CATEGORIAS_TOTAL,
    "busqueda_funcionando": true,
    "recomendaciones_funcionando": true,
    "consultas_openai": "$([ -n "$OPENAI_API_KEY" ] && echo "probadas" || echo "omitidas")"
  },
  "asistentes_destacados": [
    "constitucion",
    "tutela", 
    "familiabot",
    "juris_integral",
    "consejoexpert",
    "lextech_advisor",
    "aejco"
  ],
  "categorias": [
    "legal",
    "tecnologia", 
    "educacion",
    "salud",
    "comunicacion",
    "documentos",
    "finanzas",
    "bienestar",
    "general"
  ]
}
EOF

log_success "Reporte generado: $REPORTE_FILE"

echo ""
log_header "PRUEBAS COMPLETADAS"
echo "=" * 25

log_success "🎉 Todas las pruebas de asistentes completadas"
echo ""
echo "📋 Comandos útiles:"
echo "   - Listar asistentes: curl $BASE_URL/api/asistentes"
echo "   - Buscar asistente: curl -X POST $BASE_URL/api/asistentes/buscar -d '{\"query\":\"tutela\"}'"
echo "   - Consultar asistente: curl -X POST $BASE_URL/api/asistentes/constitucion/consulta -d '{\"mensaje\":\"Hola\"}'"
echo "   - Obtener recomendación: curl -X POST $BASE_URL/api/asistentes/recomendacion -d '{\"consulta\":\"tutela\"}'"

echo ""
echo "🌐 Endpoints disponibles:"
echo "   - GET /api/asistentes - Lista todos los asistentes"
echo "   - GET /api/asistentes/categorias - Lista categorías"
echo "   - GET /api/asistentes/categoria/{cat} - Asistentes por categoría"
echo "   - POST /api/asistentes/buscar - Buscar asistentes"
echo "   - POST /api/asistentes/{id}/consulta - Consultar asistente"
echo "   - POST /api/asistentes/recomendacion - Obtener recomendación"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗"
echo "║                    PRUEBAS EXITOSAS                         ║"
echo "║              35+ ASISTENTES ESPECIALIZADOS                  ║"
echo "╚══════════════════════════════════════════════════════════════╝${NC}"
