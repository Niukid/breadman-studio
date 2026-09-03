import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // Parsear las credenciales desde la variable de entorno configurada en Vercel
    const credentials = JSON.parse(process.env.GSPAK as string);

    // Configurar la autenticación
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], // Usa 'https://www.googleapis.com/auth/spreadsheets' si también necesitas escribir datos
    });

    // Inicializar la API de Sheets
    const sheets = google.sheets({ version: 'v4', auth });

    // ID de la hoja de cálculo (lo encuentras en la URL de tu Google Sheet)
    const spreadsheetId = 'TU_SPREADSHEET_ID_AQUI'; 
    // Rango o pestaña que deseas consultar
    const range = 'Hoja 1!A1:D10'; 

    // Leer los datos de la planilla
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    // Enviar los datos de vuelta a tu panel
    return NextResponse.json({ data: response.data.values });
    
  } catch (error) {
    console.error('Error al conectar con Google Sheets:', error);
    return NextResponse.json(
      { error: 'Hubo un error al conectar con la hoja de cálculo' }, 
      { status: 500 }
    );
  }
}
