const puppeteer = require('puppeteer');

/**
 * Generate PDF from resume data
 * @param {Object} resume - Resume document with populated template
 * @returns {Promise<Buffer>} PDF buffer
 */
const generatePDF = async (resume) => {
    let browser;

    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Generate HTML based on template
        const html = generateHTML(resume);

        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm',
            },
        });

        return pdfBuffer;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error('Failed to generate PDF');
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

/**
 * Generate HTML for resume based on template
 * @param {Object} resume - Resume data
 * @returns {string} HTML string
 */
const generateHTML = (resume) => {
    const { personalInfo, education, experience, skills, projects, certifications, qrCode } = resume;
    const template = resume.templateId;

    // Base styles
    const baseStyles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: ${template.styles.fontFamily || 'Arial'}, sans-serif;
      font-size: ${template.styles.fontSize || '12px'};
      line-height: 1.6;
      color: #333;
    }
    .container {
      padding: 20px;
    }
    h1 { font-size: 28px; margin-bottom: 5px; color: ${template.styles.primaryColor || '#000'}; }
    h2 { font-size: 18px; margin-top: 15px; margin-bottom: 10px; border-bottom: 2px solid ${template.styles.primaryColor || '#000'}; padding-bottom: 5px; }
    h3 { font-size: 14px; margin-bottom: 5px; }
    .contact-info { margin-bottom: 10px; font-size: 11px; }
    .contact-info a { color: ${template.styles.secondaryColor || '#0066cc'}; text-decoration: none; }
    .section { margin-bottom: 15px; }
    .item { margin-bottom: 10px; }
    .item-header { display: flex; justify-content: space-between; margin-bottom: 3px; }
    .date { font-style: italic; color: #666; font-size: 11px; }
    .skills-container { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill-tag { display: inline-block; padding: 4px 10px; background: #f0f0f0; border-radius: 4px; font-size: 11px; }
    ul { margin-left: 20px; }
    li { margin-bottom: 3px; }
    .qr-code { position: absolute; top: 20px; right: 20px; width: 80px; height: 80px; }
  `;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>${baseStyles}</style>
    </head>
    <body>
      <div class="container">
        ${qrCode ? `<img src="${qrCode}" class="qr-code" alt="QR Code" />` : ''}
        
        <!-- Header -->
        <h1>${personalInfo.fullName}</h1>
        <div class="contact-info">
          ${personalInfo.email} 
          ${personalInfo.phone ? ` | ${personalInfo.phone}` : ''}
          ${personalInfo.location ? ` | ${personalInfo.location}` : ''}
          <br/>
          ${personalInfo.linkedIn ? `<a href="${personalInfo.linkedIn}">LinkedIn</a> | ` : ''}
          ${personalInfo.github ? `<a href="${personalInfo.github}">GitHub</a> | ` : ''}
          ${personalInfo.portfolio ? `<a href="${personalInfo.portfolio}">Portfolio</a>` : ''}
        </div>

        ${personalInfo.summary ? `
          <div class="section">
            <h2>Professional Summary</h2>
            <p>${personalInfo.summary}</p>
          </div>
        ` : ''}

        ${experience && experience.length > 0 ? `
          <div class="section">
            <h2>Work Experience</h2>
            ${experience.map(exp => `
              <div class="item">
                <div class="item-header">
                  <h3>${exp.position} - ${exp.company}</h3>
                  <span class="date">
                    ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                  </span>
                </div>
                ${exp.description ? `<p>${exp.description}</p>` : ''}
                ${exp.achievements && exp.achievements.length > 0 ? `
                  <ul>
                    ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${education && education.length > 0 ? `
          <div class="section">
            <h2>Education</h2>
            ${education.map(edu => `
              <div class="item">
                <div class="item-header">
                  <h3>${edu.degree}${edu.field ? ` in ${edu.field}` : ''}</h3>
                  <span class="date">
                    ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                  </span>
                </div>
                <p>${edu.institution}</p>
                ${edu.grade ? `<p>Grade: ${edu.grade}</p>` : ''}
                ${edu.description ? `<p>${edu.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${skills && skills.length > 0 ? `
          <div class="section">
            <h2>Skills</h2>
            <div class="skills-container">
              ${skills.map(skill => `
                <span class="skill-tag">${skill.name}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${projects && projects.length > 0 ? `
          <div class="section">
            <h2>Projects</h2>
            ${projects.map(project => `
              <div class="item">
                <h3>${project.title}</h3>
                ${project.description ? `<p>${project.description}</p>` : ''}
                ${project.technologies && project.technologies.length > 0 ? `
                  <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
                ` : ''}
                ${project.link ? `<p><a href="${project.link}">${project.link}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${certifications && certifications.length > 0 ? `
          <div class="section">
            <h2>Certifications</h2>
            ${certifications.map(cert => `
              <div class="item">
                <div class="item-header">
                  <h3>${cert.name}</h3>
                  <span class="date">${formatDate(cert.date)}</span>
                </div>
                ${cert.issuer ? `<p>${cert.issuer}</p>` : ''}
                ${cert.link ? `<p><a href="${cert.link}">${cert.link}</a></p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};

/**
 * Format date to readable string
 * @param {Date} date - Date object
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

module.exports = { generatePDF };
