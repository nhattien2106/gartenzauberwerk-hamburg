import jsPDF from 'jspdf';

export interface FormData {
  // Basic Personal Information
  vor_nachname: string;
  anschrift?: string;
  telefon?: string;
  mobil?: string;
  email: string;
  geburt_am?: string;
  in?: string;
  status: string;
  status_sonstiges?: string;
  geschlecht: 'weiblich' | 'maennlich' | '';
  familienstand: string;
  unterhaltspflichtige_kinder?: string;
  hoechster_abschluss?: string;
  staatsangehoerigkeit?: string;
  mobilitaet?: string;
  bewoerbene_position?: string;
  iban?: string;
  bic?: string;
  bank?: string;
  renten_vers_nr?: string;
  steuer_id?: string;
  konfession?: string;
  mitglied_kv?: string | boolean;
  kv_nr?: string;
  
  // Additional Information
  agentur_meldung?: 'nein' | 'ja' | '';
  agentur_ort?: string;
  weitere_beschaeftigungen?: 'nein' | 'ja' | '';
  beschaeftigungen_details?: string;
  arbeitgeber_adresse?: string;
  kurzfristige_beschaeftigung?: 'nein' | 'ja' | '';
  kurzfristige_bis?: string;
  notizen?: string;
  
  // Declaration
  erklarung_ort_datum?: string;
  erklarung_unterschrift?: string;
}

export class PDFGenerator {
  private pdf: jsPDF;
  private logoDataUrl: string | null = null;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
  }

  private async loadLogo(): Promise<string | null> {
    try {
      const response = await fetch('/images/Logo_GZW_Horizontal_300x65px.png');
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Failed to load logo:', error);
      return null;
    }
  }

  private drawHeader(): void {
    // Title
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('MITARBEITERSTAMMDATEN', 20, 20);
    
    // Logo
    if (this.logoDataUrl) {
      this.pdf.addImage(this.logoDataUrl, 'PNG', 130, 10, 50, 10.8);
    } else {
      // Fallback to text if image fails to load
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('GARTENZAUBERWERK', 150, 20);
    }
  }

    private drawPersonalData(formData: FormData): number {
    let yPos = 45;
    const leftMargin = 20;
    const lineHeight = 6; // Increased from 5 to 6 for better spacing

    // Section title
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Persönliche Daten', leftMargin, yPos);
    yPos += 6; // Increased from 5 to 6

    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'normal');

    // Personal fields with underlines
    const personalFields = [
      { label: 'Vor & Nachname:', value: formData.vor_nachname, width: 60 },
      { label: 'Anschrift:', value: formData.anschrift || '', width: 60 },
      { label: 'Telefon:', value: formData.telefon || '', width: 60 },
      { label: 'Mobil:', value: formData.mobil || '', width: 60 },
      { label: 'E-Mail:', value: formData.email, width: 60 },
      { label: 'Geburt am:', value: formData.geburt_am || '', width: 30 },
      { label: 'in:', value: formData.in || '', width: 30 }
    ];

    personalFields.forEach((field) => {
      this.pdf.text(field.label, leftMargin, yPos);
      this.pdf.line(leftMargin + 25, yPos + 1, leftMargin + 25 + Math.min(field.width, 40), yPos + 1);
      if (field.value) {
        this.pdf.setFontSize(6);
        // Word wrap the text with proper width calculation
        const availableWidth = Math.min(field.width, 50) - 2; // Increased from 40 to 50 for better wrapping
        const wrappedText = this.pdf.splitTextToSize(String(field.value), availableWidth);
        wrappedText.forEach((line: string, index: number) => {
          this.pdf.text(line, leftMargin + 27, yPos - 1 + (index * 3));
        });
        yPos += Math.max(wrappedText.length * 3, lineHeight); // Adjust position based on wrapped text
      } else {
        yPos += lineHeight;
      }
    });

    return yPos;
  }

  private drawStatusAndGender(formData: FormData, yPos: number): number {
    // Status Section
    yPos += 3; // Increased from 2 to 3
    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Status:', 20, yPos);
    yPos += 4; // Increased from 3 to 4

    this.pdf.setFontSize(6);
    this.pdf.setFont('helvetica', 'normal');

    const statusOptions = ['Schüler/in', 'Auszubildende/r', 'Student/in', 'Angestellte/r', 'Arbeitssuchend', 'Rentner/in', 'Sonstiges'];
    const selectedStatus = formData.status;

    // Show all status options with checkboxes in 2 columns, but only mark the selected one
    statusOptions.forEach((option, index) => {
      const column = index % 2; // 0 for left column, 1 for right column
      const row = Math.floor(index / 2); // 0, 1, 2, 3 for rows
      const x = 20 + (column * 45); // 45mm spacing between columns
      const y = yPos + (row * 4); // 4mm spacing between rows
      
      this.pdf.rect(x, y - 2, 2, 2);
      if (option === selectedStatus) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('X', x + 0.3, y - 0.3);
        this.pdf.setFont('helvetica', 'normal');
      }
      this.pdf.text(option, x + 4, y);
      
      // Add input line for "Sonstiges"
      if (option === 'Sonstiges') {
        this.pdf.line(x + 20, y + 1, x + 45, y + 1);
        if (formData.status_sonstiges) {
          this.pdf.setFontSize(6);
          this.pdf.text(formData.status_sonstiges, x + 22, y - 0.5);
        }
      }
    });

    // Gender Section - moved down to accommodate 2-column Status layout
    yPos += 16; // Increased from 8 to 16 to account for 2 rows of Status options
    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Geschlecht:', 20, yPos);
    yPos += 4; // Increased from 3 to 4

    this.pdf.setFontSize(6);
    this.pdf.setFont('helvetica', 'normal');

    const genderOptions = ['Weiblich', 'Männlich'];
    genderOptions.forEach((option, index) => {
      const x = 20 + (index * 25); // Space them out horizontally
      this.pdf.rect(x, yPos - 2, 2, 2);
      // Only mark if explicitly selected (no default selection)
      if ((option === 'Weiblich' && formData.geschlecht === 'weiblich') || 
          (option === 'Männlich' && formData.geschlecht === 'maennlich')) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('X', x + 0.3, yPos - 0.3);
        this.pdf.setFont('helvetica', 'normal');
      }
      this.pdf.text(option, x + 4, yPos);
    });

    return yPos;
  }

  private drawFamilyAndBankingData(formData: FormData, yPos: number): number {
    const leftMargin = 20;
    const lineHeight = 6; // Increased from 5 to 6

    // Family Information - moved down to accommodate Gender section spacing
    yPos += 35; // Increased from 25 to 35 to provide more space after Gender section
    const familyFields = [
      { label: 'Familienstand:', value: formData.familienstand, width: 40 },
      { label: 'unterhaltspflichtige Kinder:', value: formData.unterhaltspflichtige_kinder || '', width: 15 },
      { label: 'Höchster Abschluss:', value: formData.hoechster_abschluss || '', width: 40 },
      { label: 'Staatsangehörigkeit:', value: formData.staatsangehoerigkeit || '', width: 40 },
      { label: 'Mobilität:', value: formData.mobilitaet || '', width: 40 },
      { label: 'Beworbene Position:', value: formData.bewoerbene_position || '', width: 40 }
    ];

    familyFields.forEach((field) => {
      this.pdf.text(field.label, leftMargin, yPos);
      this.pdf.line(leftMargin + 25, yPos + 1, leftMargin + 25 + Math.min(field.width, 45), yPos + 1);
      if (field.value) {
        this.pdf.setFontSize(6);
        // Word wrap the text with proper width calculation
        const availableWidth = Math.min(field.width, 45) - 2; // Increased from 35 to 45 for better wrapping
        const wrappedText = this.pdf.splitTextToSize(String(field.value), availableWidth);
        wrappedText.forEach((line: string, index: number) => {
          this.pdf.text(line, leftMargin + 27, yPos - 1 + (index * 3));
        });
        yPos += Math.max(wrappedText.length * 3, lineHeight); // Adjust position based on wrapped text
      } else {
        yPos += lineHeight;
      }
    });

    // Banking Information
    yPos += 4; // Increased from 3 to 4
    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Bankdaten', leftMargin, yPos);
    yPos += 4; // Increased from 3 to 4

    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'normal');

    const bankingFields = [
      { label: 'IBAN:', value: formData.iban || '', width: 50 },
      { label: 'BIC:', value: formData.bic || '', width: 30 },
      { label: 'Bank:', value: formData.bank || '', width: 30 },
      { label: 'Renten-Vers. Nr.:', value: formData.renten_vers_nr || '', width: 50 },
      { label: 'Steuer-ID:', value: formData.steuer_id || '', width: 50 },
      { label: 'Konfession:', value: formData.konfession || '', width: 40 },
      { label: 'KV-Nr.:', value: formData.kv_nr || '', width: 40 }
    ];

    bankingFields.forEach((field) => {
      this.pdf.text(field.label, leftMargin, yPos);
      this.pdf.line(leftMargin + 25, yPos + 1, leftMargin + 25 + Math.min(field.width, 45), yPos + 1);
      if (field.value) {
        this.pdf.setFontSize(6);
        // Word wrap the text with proper width calculation
        const availableWidth = Math.min(field.width, 45) - 2; // Increased from 35 to 45 for better wrapping
        const wrappedText = this.pdf.splitTextToSize(String(field.value), availableWidth);
        wrappedText.forEach((line: string, index: number) => {
          this.pdf.text(line, leftMargin + 27, yPos - 1 + (index * 3));
        });
        yPos += Math.max(wrappedText.length * 3, lineHeight); // Adjust position based on wrapped text
      } else {
        yPos += lineHeight;
      }
    });

    // Health Insurance line input
    yPos += 2; // Add extra space before line input
    this.pdf.text('Mitglied in gesetzl. KV:', leftMargin, yPos);
    this.pdf.line(leftMargin + 25, yPos + 1, leftMargin + 55, yPos + 1);
    if (formData.mitglied_kv) {
      this.pdf.setFontSize(6);
      // Word wrap the text with proper width calculation
      const availableWidth = 30; // 55 - 25 = 30 characters
      const wrappedText = this.pdf.splitTextToSize('Ja', availableWidth);
      wrappedText.forEach((line: string, index: number) => {
        this.pdf.text(line, leftMargin + 27, yPos - 1 + (index * 3));
      });
      yPos += Math.max(wrappedText.length * 3, lineHeight); // Adjust position based on wrapped text
    } else {
      yPos += lineHeight;
    }

    return yPos;
  }

  private drawRightColumn(formData: FormData): void {
    console.log('Drawing right column with data:', {
      agentur_meldung: formData.agentur_meldung,
      agentur_ort: formData.agentur_ort,
      weitere_beschaeftigungen: formData.weitere_beschaeftigungen,
      beschaeftigungen_details: formData.beschaeftigungen_details,
      arbeitgeber_adresse: formData.arbeitgeber_adresse,
      kurzfristige_beschaeftigung: formData.kurzfristige_beschaeftigung,
      kurzfristige_bis: formData.kurzfristige_bis,
      notizen: formData.notizen
    });
    
    const rightMargin = 110;
    let yPos = 45;

    // Agency Question
    this.pdf.setFontSize(5);
    const agencyQuestion = 'Liegt zu Beginn des Beschäftigungsverhältnisses eine Meldung als arbeits- oder ausbildungssuchend bei der Agentur für Arbeit vor oder/und lautet der dortige Status „beschäftigungslos"?';
    const agencyLines = this.pdf.splitTextToSize(agencyQuestion, 70);
    agencyLines.forEach((line: string, index: number) => {
      this.pdf.text(line, rightMargin, yPos + (index * 3));
    });
    yPos += agencyLines.length * 3;
    yPos += 6; // Increased from 4 to 6

    this.pdf.setFontSize(7);
    const agencyOptions = ['Nein', 'Ja bei der Agentur für Arbeit in:'];
    agencyOptions.forEach((option, index) => {
      const x = rightMargin + (index * 35);
      this.pdf.rect(x, yPos - 2, 2, 2);
      if ((option === 'Nein' && formData.agentur_meldung === 'nein') || 
          (option === 'Ja bei der Agentur für Arbeit in:' && formData.agentur_meldung === 'ja')) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('X', x + 0.3, yPos - 0.3);
        this.pdf.setFont('helvetica', 'normal');
      }
      this.pdf.text(option, x + 4, yPos);
    });

    // Display agentur_ort input line (always show)
    yPos += 6; // Increased spacing for better positioning
    this.pdf.setFontSize(6);
    this.pdf.text('Ort:', rightMargin, yPos);
    this.pdf.line(rightMargin + 8, yPos + 1, rightMargin + 78, yPos + 1);
    
    // Display text if "Ja" is selected
    if (formData.agentur_meldung === 'ja' && formData.agentur_ort) {
      // Word wrap the text
      const wrappedText = this.pdf.splitTextToSize(formData.agentur_ort, 68); // 70 - 2 for margin
      wrappedText.forEach((line: string, index: number) => {
        this.pdf.text(line, rightMargin + 10, yPos - 1 + (index * 3));
      });
      yPos += Math.max(wrappedText.length * 3, 4); // Adjust position based on wrapped text
    } else {
      yPos += 4; // Space for empty line
    }

    // Additional Employment Question
    yPos += 10; // Increased from 8 to 10 for better centering
    this.pdf.setFontSize(5);
    const employmentQuestion = 'Bestehen derzeit weitere Beschäftigungsverhältnisse?';
    const employmentLines = this.pdf.splitTextToSize(employmentQuestion, 70);
    employmentLines.forEach((line: string, index: number) => {
      this.pdf.text(line, rightMargin, yPos + (index * 3));
    });
    yPos += employmentLines.length * 3;
    yPos += 8; // Increased from 6 to 8 for better centering

    this.pdf.setFontSize(7);
    const employmentOptions = ['Nein', 'Ja, ich übe folgende Beschäftigung/en aus:'];
    employmentOptions.forEach((option, index) => {
      const x = rightMargin + (index * 35);
      this.pdf.rect(x, yPos - 2, 2, 2);
      if ((option === 'Nein' && formData.weitere_beschaeftigungen === 'nein') || 
          (option === 'Ja, ich übe folgende Beschäftigung/en aus:' && formData.weitere_beschaeftigungen === 'ja')) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('X', x + 0.3, yPos - 0.3);
        this.pdf.setFont('helvetica', 'normal');
      }
      this.pdf.text(option, x + 4, yPos);
    });

    // Display beschaeftigungen_details input line (always show)
    yPos += 6; // Increased spacing for better positioning
    this.pdf.setFontSize(6);
    this.pdf.text('Details:', rightMargin, yPos);
    this.pdf.line(rightMargin + 12, yPos + 1, rightMargin + 82, yPos + 1);
    
    // Display text if "Ja" is selected
    if (formData.weitere_beschaeftigungen === 'ja' && formData.beschaeftigungen_details) {
      // Word wrap the text
      const wrappedText = this.pdf.splitTextToSize(formData.beschaeftigungen_details, 68); // 70 - 2 for margin
      wrappedText.forEach((line: string, index: number) => {
        this.pdf.text(line, rightMargin + 14, yPos - 1 + (index * 3));
      });
      yPos += Math.max(wrappedText.length * 3, 4); // Adjust position based on wrapped text
    } else {
      yPos += 4; // Space for empty line
    }

    // Display arbeitgeber_adresse input line (always show)
    if (formData.weitere_beschaeftigungen === 'ja') {
      yPos += 6; // Increased spacing for better positioning
      this.pdf.setFontSize(6);
      this.pdf.text('Arbeitgeber Adresse:', rightMargin, yPos);
      this.pdf.line(rightMargin + 25, yPos + 1, rightMargin + 95, yPos + 1);
      
      // Display text if provided
      if (formData.arbeitgeber_adresse) {
        // Word wrap the text
        const wrappedText = this.pdf.splitTextToSize(formData.arbeitgeber_adresse, 68); // 70 - 2 for margin
        wrappedText.forEach((line: string, index: number) => {
          this.pdf.text(line, rightMargin + 27, yPos - 1 + (index * 3));
        });
        yPos += Math.max(wrappedText.length * 3, 4); // Adjust position based on wrapped text
      } else {
        yPos += 4; // Space for empty line
      }
    }

    // Short-term Employment Question
    yPos += 20; // Increased from 18 to 20 for better centering
    this.pdf.setFontSize(5);
    const shortTermQuestion = 'Wurde in den letzten zwölf Kalendermonaten einer kurzfristigen Beschäftigung nachgegangen?';
    const shortTermLines = this.pdf.splitTextToSize(shortTermQuestion, 70);
    shortTermLines.forEach((line: string, index: number) => {
      this.pdf.text(line, rightMargin, yPos + (index * 3));
    });
    yPos += shortTermLines.length * 3;
    yPos += 8; // Increased from 6 to 8 for better centering

    this.pdf.setFontSize(7);
    const shortTermOptions = ['Nein', 'Ja und zwar bis zum:'];
    shortTermOptions.forEach((option, index) => {
      const x = rightMargin + (index * 35);
      this.pdf.rect(x, yPos - 2, 2, 2);
      if ((option === 'Nein' && formData.kurzfristige_beschaeftigung === 'nein') || 
          (option === 'Ja und zwar bis zum:' && formData.kurzfristige_beschaeftigung === 'ja')) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text('X', x + 0.3, yPos - 0.3);
        this.pdf.setFont('helvetica', 'normal');
      }
      this.pdf.text(option, x + 4, yPos);
    });

    // Display kurzfristige_bis input line (always show)
    yPos += 6; // Increased spacing for better positioning
    this.pdf.setFontSize(6);
    this.pdf.text('Bis zum:', rightMargin, yPos);
    this.pdf.line(rightMargin + 12, yPos + 1, rightMargin + 82, yPos + 1);
    
    // Display text if "Ja" is selected
    if (formData.kurzfristige_beschaeftigung === 'ja' && formData.kurzfristige_bis) {
      // Word wrap the text
      const wrappedText = this.pdf.splitTextToSize(formData.kurzfristige_bis, 68); // 70 - 2 for margin
      wrappedText.forEach((line: string, index: number) => {
        this.pdf.text(line, rightMargin + 14, yPos - 1 + (index * 3));
      });
      yPos += Math.max(wrappedText.length * 3, 4); // Adjust position based on wrapped text
    } else {
      yPos += 4; // Space for empty line
    }

    // Notes
    yPos += 8; // Increased from 6 to 8
    this.pdf.setFontSize(7);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Notizen:', rightMargin, yPos);
    this.pdf.rect(rightMargin, yPos + 2, 70, 15);
    if (formData.notizen) {
      this.pdf.setFontSize(5);
      const wrappedNotes = this.pdf.splitTextToSize(formData.notizen, 66);
      wrappedNotes.forEach((line: string, index: number) => {
        this.pdf.text(line, rightMargin + 2, yPos + 4 + (index * 3));
      });
    }

    // Declaration
    yPos += 22; // Increased from 20 to 22
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Erklärung', rightMargin, yPos);
    yPos += 6; // Increased from 4 to 6

    this.pdf.setFontSize(5);
    this.pdf.setFont('helvetica', 'normal');
    const declarationText = 'Ich versichere, dass die auf diesem Dokument gemachten Angaben der Wahrheit entsprechen. Ich verpflichte mich, meinem Arbeitgeber alle Änderungen, insbesondere in Bezug auf weitere Beschäftigungen (Art, Dauer und Entgelt) oder Änderungen bzgl. des Arbeitssuchend-Status, Studenten-Status oder Schüler-Status unverzüglich mitzuteilen.';
    const declarationLines = this.pdf.splitTextToSize(declarationText, 70);
    declarationLines.forEach((line: string, index: number) => {
      this.pdf.text(line, rightMargin, yPos + (index * 3));
    });
    yPos += declarationLines.length * 3;

    // Signature lines
    yPos += 12; // Increased from 10 to 12
    this.pdf.setFontSize(7);
    this.pdf.text('Ort, Datum:', rightMargin, yPos);
    this.pdf.line(rightMargin + 20, yPos + 1, rightMargin + 40, yPos + 1);
    if (formData.erklarung_ort_datum) {
      this.pdf.setFontSize(6);
      this.pdf.text(formData.erklarung_ort_datum, rightMargin + 22, yPos - 0.5);
    }
    
    this.pdf.setFontSize(7);
    this.pdf.text('Unterschrift:', rightMargin + 50, yPos);
    this.pdf.line(rightMargin + 65, yPos + 1, rightMargin + 85, yPos + 1);
    if (formData.erklarung_unterschrift) {
      // Check if it's a data URL (signature image)
      if (formData.erklarung_unterschrift.startsWith('data:image')) {
        try {
          // Add signature image to PDF
          this.pdf.addImage(formData.erklarung_unterschrift, 'PNG', rightMargin + 67, yPos - 8, 20, 8);
        } catch (error) {
          console.error('Error adding signature image to PDF:', error);
        }
      } else {
        // Fallback to text if it's not an image
        this.pdf.setFontSize(6);
        this.pdf.text(formData.erklarung_unterschrift, rightMargin + 67, yPos - 0.5);
      }
    }
  }

  private drawEmployerSection(): void {
    let yPos = 235; // Increased from 220 to 235 to provide more space after banking section
    
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.setLineWidth(0.2); // Reduced from 0.5 to 0.2 for thinner lines
    this.pdf.line(20, yPos, 105, yPos); // Only left half of the page
    yPos += 6;

    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('VOM ARBEITGEBER AUSZUFÜLLEN', 62, yPos, { align: 'center' }); // Centered in left half
    yPos += 5;

    this.pdf.setFontSize(6);
    this.pdf.setFont('helvetica', 'normal');

    const employerFields = [
      { label: 'Eintrittsdatum:', x: 20 },
      { label: 'Personalnummer:', x: 20 },
      { label: 'Arbeitszeit/Woche:', x: 20 },
      { label: 'Befristung:', x: 20 },
      { label: 'Kündigung zum:', x: 20 },
      { label: 'Mögliche Probearbeitstage:', x: 20 }
    ];

    employerFields.forEach((field, index) => {
      const y = yPos + index * 6; // Stack vertically with proper spacing
      const x = field.x;
      this.pdf.text(field.label, x, y);
      // Align line with the end of the label text
      const labelWidth = this.pdf.getTextWidth(field.label);
      this.pdf.line(x + labelWidth + 2, y + 1, x + labelWidth + 32, y + 1);
    });
  }

  private drawFooter(): void {
    // Document ID
    this.pdf.setFontSize(5);
    this.pdf.text('Dokumenten id:', 170, 270);
    this.pdf.line(185, 270, 195, 270);
  }

  public async generatePDF(formData: FormData): Promise<void> {
    try {
      // Load logo
      this.logoDataUrl = await this.loadLogo();

      // Draw all sections
      this.drawHeader();
      const yPos = this.drawPersonalData(formData);
      this.drawStatusAndGender(formData, yPos);
      this.drawFamilyAndBankingData(formData, yPos);
      this.drawRightColumn(formData);
      this.drawEmployerSection();
      this.drawFooter();

      // Save the PDF
      this.pdf.save('mitarbeiterstammdaten.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
}

// Export a simple function for easy use
export const generateMitarbeiterstammdatenPDF = async (formData: FormData): Promise<void> => {
  const generator = new PDFGenerator();
  await generator.generatePDF(formData);
}; 