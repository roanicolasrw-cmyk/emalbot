// ============================================================================
// EMALBOT - Archivo para Android Studio (Kotlin + Jetpack Compose + Material 3)
// Escuela N° 2702 EMAL - Educación de Jóvenes y Adultos
//
// INSTRUCCIONES EN ANDROID STUDIO:
// 1. Creá un proyecto nuevo "Empty Activity" (Jetpack Compose).
// 2. En AndroidManifest.xml agregá:
//    <uses-permission android:name="android.permission.INTERNET" />
// 3. Reemplazá tu MainActivity.kt con este archivo (ajustando el `package`
//    de la línea 15 al package de tu proyecto) o pasáselo directo a la IA
//    de Android Studio para integrarlo.
//
// INCLUYE 2 MODOS EN LA MISMA APP PARA EL STAND:
// - Modo "Demo Nativa RAG (Offline)": Funciona sin internet en el stand
//   con Paso 1 (Formulario -> Drive) + Paso 2 (Motor RAG) + Voz (TTS).
// - Modo "App Web En Vivo": Abre la app web real de EMALBOT en WebView.
// ============================================================================

package com.escuela2702.emalbot

import android.annotation.SuppressLint
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.viewinterop.AndroidView
import java.text.Normalizer
import java.util.Locale

class MainActivity : ComponentActivity(), TextToSpeech.OnInitListener {

    private var tts: TextToSpeech? = null
    private var ttsReady = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        tts = TextToSpeech(this, this)

        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = Color(0xFF0284C7),
                    secondary = Color(0xFF10B981),
                    background = Color(0xFF020617),
                    surface = Color(0xFF0F172A),
                    onPrimary = Color.White,
                    onBackground = Color(0xFFF8FAFC),
                    onSurface = Color(0xFFF8FAFC)
                )
            ) {
                EmalbotAndroidStandApp(
                    onSpeak = { text -> speakText(text) },
                    onStopSpeak = { tts?.stop() }
                )
            }
        }
    }

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            val res = tts?.setLanguage(Locale("es", "AR"))
            ttsReady = res != TextToSpeech.LANG_MISSING_DATA &&
                res != TextToSpeech.LANG_NOT_SUPPORTED
        }
    }

    private fun speakText(text: String) {
        if (ttsReady) {
            tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "emalbot_tts")
        }
    }

    override fun onDestroy() {
        tts?.stop()
        tts?.shutdown()
        super.onDestroy()
    }
}

// ----------------------------------------------------------------------------
// MODELOS DE DATOS PARA LA DEMO NATIVA RAG (PASO 1 Y PASO 2)
// ----------------------------------------------------------------------------
data class DriveDocument(
    val id: String,
    val title: String,
    val category: String,
    val moduleLevel: String,
    val author: String,
    val content: String,
    val isFromGoogleForm: Boolean = false
)

data class RagMatchResult(
    val doc: DriveDocument,
    val score: Int,
    val matchedTerms: List<String>
)

data class RagQueryResponse(
    val keywords: List<String>,
    val matches: List<RagMatchResult>,
    val answerText: String,
    val processingMs: Long
)

private val STOP_WORDS = setOf(
    "el", "la", "los", "las", "un", "una", "de", "del", "al", "a", "en", "y", "o",
    "que", "quien", "quienes", "cual", "como", "donde", "cuando", "por", "para",
    "con", "es", "son", "era", "fue", "esta", "hay", "mi", "tu", "su", "me", "se"
)

fun normalizeText(input: String): String {
    val decomposed = Normalizer.normalize(input.lowercase(), Normalizer.Form.NFD)
    return decomposed
        .replace(Regex("\\p{InCombiningDiacriticalMarks}+"), "")
        .replace(Regex("[^a-z0-9\\s]"), " ")
        .replace(Regex("\\s+"), " ")
        .trim()
}

fun extractKeywords(query: String): List<String> {
    return normalizeText(query)
        .split(" ")
        .filter { it.length >= 2 && it !in STOP_WORDS }
        .distinct()
}

fun runLocalRagEngine(query: String, driveDocs: List<DriveDocument>): RagQueryResponse {
    val startMs = System.currentTimeMillis()
    val keywords = extractKeywords(query)
    val normQuery = normalizeText(query)
    val isTeacherQuery = Regex("profesor|profesora|docente|quien|enseña|cargo").containsMatchIn(normQuery)

    val scored = driveDocs.mapNotNull { doc ->
        val normTitle = normalizeText(doc.title)
        val normCat = normalizeText(doc.category)
        val normContent = normalizeText(doc.content)
        val normAuthor = normalizeText(doc.author)
        val combined = "$normTitle $normCat $normContent $normAuthor"

        var score = 0
        val matched = mutableListOf<String>()

        for (term in keywords) {
            when {
                normTitle.contains(term) -> {
                    score += 14
                    matched.add(term)
                }
                normCat.contains(term) -> {
                    score += 12
                    matched.add(term)
                }
                normContent.contains(term) || normAuthor.contains(term) -> {
                    score += 9
                    matched.add(term)
                }
            }
        }

        if (normCat.isNotEmpty() && normQuery.contains(normCat)) {
            score += 20
        }
        if (isTeacherQuery && Regex("profesor|profesora|docente|titular").containsMatchIn(combined)) {
            score += 22
        }
        if (matched.isNotEmpty() && doc.isFromGoogleForm) {
            score += 30
        }

        if (score > 0) RagMatchResult(doc, score, matched.distinct()) else null
    }.sortedByDescending { it.score }

    val topMatches = scored.take(3)
    val answerText = if (topMatches.isNotEmpty()) {
        val primary = topMatches.first().doc
        buildString {
            appendLine("Información recuperada de Google Drive (${primary.category}):")
            appendLine("Documento: ${primary.title} (${primary.moduleLevel})")
            appendLine("Cargado por: ${primary.author}")
            appendLine()
            appendLine(primary.content)
            appendLine()
            append("Matrícula 2027 · Secretaría Escuela N° 2702 EMAL: Lunes a Viernes de 19:15 a 22:15 hs.")
        }
    } else {
        "No se encontraron coincidencias exactas. Probá consultar sobre Matrícula 2027, horarios de Secretaría (19:15 a 22:15 hs) o materias como Nuevas Tecnologías, Matemáticas, Lengua o Cs. Naturales."
    }

    val elapsed = (System.currentTimeMillis() - startMs).coerceAtLeast(8L)
    return RagQueryResponse(
        keywords = keywords,
        matches = topMatches,
        answerText = answerText,
        processingMs = elapsed
    )
}

// ----------------------------------------------------------------------------
// INTERFAZ PRINCIPAL ANDROID (SELECTOR: DEMO NATIVA RAG vs DEMO WEB EN VIVO)
// ----------------------------------------------------------------------------
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmalbotAndroidStandApp(
    onSpeak: (String) -> Unit,
    onStopSpeak: () -> Unit
) {
    var selectedTab by remember { mutableIntStateOf(0) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "EMALBOT · Matrícula 2027",
                            fontWeight = FontWeight.Bold,
                            fontSize = 16.sp
                        )
                        Text(
                            text = "Escuela N° 2702 EMAL · Secretaría 19:15 a 22:15 hs",
                            fontSize = 11.sp,
                            color = Color(0xFF94A3B8)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFF0F172A),
                    titleContentColor = Color.White
                )
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF020617))
                .padding(padding)
        ) {
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = Color(0xFF0F172A),
                contentColor = Color.White
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Demo Nativa RAG (Offline)", fontSize = 12.sp) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("App Web En Vivo", fontSize = 12.sp) }
                )
            }

            if (selectedTab == 0) {
                NativeStandDemoScreen(onSpeak = onSpeak, onStopSpeak = onStopSpeak)
            } else {
                LiveWebViewScreen(
                    url = "https://ais-pre-4nkl37fbgrcnwl73snqpbt-851099285085.us-east1.run.app"
                )
            }
        }
    }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun LiveWebViewScreen(url: String) {
    AndroidView(
        modifier = Modifier.fillMaxSize(),
        factory = { context ->
            WebView(context).apply {
                webViewClient = WebViewClient()
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                settings.cacheMode = WebSettings.LOAD_DEFAULT
                loadUrl(url)
            }
        }
    )
}

@Composable
fun NativeStandDemoScreen(
    onSpeak: (String) -> Unit,
    onStopSpeak: () -> Unit
) {
    val driveDocs = remember {
        mutableStateListOf(
            DriveDocument(
                id = "doc-01",
                title = "Circular_Matricula_2027_Inscripciones.docx",
                category = "Área Institucional",
                moduleLevel = "General",
                author = "Secretaría EMAL",
                content = "MATRÍCULA 2027 - INSCRIPCIONES ABIERTAS: 1) Preinscripción online en https://docs.google.com/forms/d/e/1FAIpQLScIxCNeBE2veAN4dWndcrJONM8sUaOh7UMfgRuNc7j6NOUsgw/viewform?usp=sf_link. 2) Luego llevar la documentación presencial (DNI original y fotocopia, certificado primario o analítico parcial, partida de nacimiento y 2 fotos 4x4) en Güemes 710 de 19:15 a 22:00 hs."
            ),
            DriveDocument(
                id = "doc-02",
                title = "Apunte_NTICx_Roa_Nicolas.gdoc",
                category = "Nuevas Tecnologías",
                moduleLevel = "Módulo 1 y 2",
                author = "Prof. Roa Nicolás",
                content = "Nuevas Tecnologías (Prof. Roa Nicolás · Módulos 1 y 2): Hardware (componentes físicos) y Software (programas y sistemas). Almacenamiento en Google Drive, contraseñas seguras y prevención de phishing."
            ),
            DriveDocument(
                id = "doc-03",
                title = "Guia_Matematicas_1y2_Zaneta.pdf",
                category = "Matemáticas",
                moduleLevel = "Módulo 1 y 2",
                author = "Prof. Zaneta Sebastián",
                content = "Matemáticas 1° y 2° año (Prof. Zaneta Sebastián): Números enteros, regla de signos, fracciones, porcentajes, regla de tres simple y ecuaciones de primer grado."
            ),
            DriveDocument(
                id = "doc-04",
                title = "Guia_Lengua_1y2_Evans.gdoc",
                category = "Lengua",
                moduleLevel = "Módulo 1 y 2",
                author = "Prof. Evans Erika",
                content = "Lengua 1° y 2° año (Prof. Evans Erika): Comprensión lectora, tipos de texto, conectores de cohesión y reglas de acentuación (agudas, graves y esdrújulas)."
            ),
            DriveDocument(
                id = "doc-05",
                title = "Cartilla_CsNaturales_1y2_Mundaca.pdf",
                category = "Cs. Naturales",
                moduleLevel = "Módulo 1 y 2",
                author = "Prof. Mundaca Yamila",
                content = "Cs. Naturales 1° y 2° año (Prof. Mundaca Yamila): La célula (procariota, eucariota animal y vegetal), ecosistemas (factores bióticos y abióticos), estados de la materia y prevención de la salud."
            )
        )
    }

    // Estado Paso 1: Formulario Docente / Secretaría -> Drive
    var formCategory by remember { mutableStateOf("Nuevas Tecnologías") }
    var formModule by remember { mutableStateOf("Módulo 1 y 2") }
    var formAuthor by remember { mutableStateOf("Prof. Roa Nicolás") }
    var formTitle by remember { mutableStateOf("Docente_Nuevas_Tecnologias_Roa.gdoc") }
    var formContent by remember {
        mutableStateOf(
            "El profesor de Nuevas Tecnologías (Módulos 1 y 2) es el Prof. Roa Nicolás."
        )
    }
    var savedBanner by remember { mutableStateOf<String?>(null) }

    // Estado Paso 2: Consulta RAG
    var queryText by remember { mutableStateOf("¿Quién es el profesor de Nuevas Tecnologías?") }
    var ragResult by remember { mutableStateOf<RagQueryResponse?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // TARJETA PASO 1: FORMULARIO GOOGLE -> GOOGLE DRIVE
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF0F172A), RoundedCornerShape(16.dp))
                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text(
                text = "PASO 1 · Formulario Escolar -> Google Drive",
                fontWeight = FontWeight.Bold,
                color = Color(0xFFC4B5FD),
                fontSize = 13.sp
            )
            Text(
                text = "Cargá un dato real (ej: Prof. Roa Nicolás, Prof. Zaneta Sebastián, Prof. Evans Erika o Prof. Mundaca Yamila).",
                color = Color(0xFF94A3B8),
                fontSize = 12.sp
            )

            OutlinedTextField(
                value = formCategory,
                onValueChange = { formCategory = it },
                label = { Text("Carpeta / Materia en Drive") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = formAuthor,
                onValueChange = { formAuthor = it },
                label = { Text("Docente o Secretaría") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = formTitle,
                onValueChange = { formTitle = it },
                label = { Text("Nombre del documento") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            OutlinedTextField(
                value = formContent,
                onValueChange = { formContent = it },
                label = { Text("Contenido oficial a guardar") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 3
            )

            Button(
                onClick = {
                    val newDoc = DriveDocument(
                        id = "form-${System.currentTimeMillis()}",
                        title = formTitle.ifBlank { "Carga_Formulario.gdoc" },
                        category = formCategory.ifBlank { "General" },
                        moduleLevel = formModule,
                        author = formAuthor.ifBlank { "Docente EMAL" },
                        content = formContent,
                        isFromGoogleForm = true
                    )
                    driveDocs.add(0, newDoc)
                    savedBanner = "Guardado en Drive ($formCategory) · ${driveDocs.size} docs activos."
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF7C3AED))
            ) {
                Text("Enviar Formulario y Guardar en Drive", fontWeight = FontWeight.Bold)
            }

            savedBanner?.let { msg ->
                Text(
                    text = msg,
                    color = Color(0xFF34D399),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        // TARJETA PASO 2: CONSULTA + MOTOR RAG
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFF0F172A), RoundedCornerShape(16.dp))
                .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(16.dp))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text(
                text = "PASO 2 · Consulta del Estudiante + Motor RAG",
                fontWeight = FontWeight.Bold,
                color = Color(0xFF38BDF8),
                fontSize = 13.sp
            )

            OutlinedTextField(
                value = queryText,
                onValueChange = { queryText = it },
                label = { Text("Pregunta del estudiante") },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = {
                    ragResult = runLocalRagEngine(queryText, driveDocs)
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0284C7))
            ) {
                Text("Consultar a EMALBOT (Ejecutar RAG)", fontWeight = FontWeight.Bold)
            }

            ragResult?.let { res ->
                Spacer(modifier = Modifier.height(4.dp))

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF020617), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFF1E293B), RoundedCornerShape(12.dp))
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(
                        text = "Proceso RAG (${res.processingMs} ms · ${driveDocs.size} docs escaneados)",
                        color = Color(0xFFA5B4FC),
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                    Text(
                        text = "Palabras clave: ${res.keywords.joinToString(", ")}",
                        color = Color(0xFF38BDF8),
                        fontFamily = FontFamily.Monospace,
                        fontSize = 11.sp
                    )
                    res.matches.forEachIndexed { index, m ->
                        Text(
                            text = "#${index + 1} ${m.doc.title} · Score ${m.score}",
                            color = Color(0xFF34D399),
                            fontSize = 11.sp
                        )
                    }
                }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Color(0xFF020617), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFF0284C7), RoundedCornerShape(12.dp))
                        .padding(12.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = "Respuesta de EMALBOT:",
                        color = Color(0xFF38BDF8),
                        fontWeight = FontWeight.Bold,
                        fontSize = 12.sp
                    )
                    Text(
                        text = res.answerText,
                        color = Color(0xFFE2E8F0),
                        fontSize = 13.sp,
                        lineHeight = 19.sp
                    )

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        OutlinedButton(onClick = { onSpeak(res.answerText) }) {
                            Text("Escuchar en Voz Alta", fontSize = 12.sp)
                        }
                        OutlinedButton(onClick = onStopSpeak) {
                            Text("Detener", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}
