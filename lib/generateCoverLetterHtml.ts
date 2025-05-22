export function generateCoverLetterHtml(name: string): string {
  return `
  <div style="font-family:'Segoe UI', Roboto, sans-serif; background-color:#f9f9f9; padding:2rem; max-width:800px; margin:auto; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1); color:#333;">
    <div style="background-color:#005bbb; color:white; padding:1rem 2rem; border-radius:8px 8px 0 0;">
      <h1 style="margin:0; font-size:1.75rem;">Cover Letter – Vikram Kumar</h1>
    </div>
    <div style="padding:2rem; background:white; border-radius:0 0 8px 8px;">
      <p style="font-size:1rem; line-height:1.7;">
        <strong>Dear ${name},</strong>
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        As a highly accomplished Full Stack Developer with over a decade of hands-on experience in
        architecting and implementing dynamic, scalable web applications, I bring a comprehensive
        skillset encompassing both front-end and back-end technologies, coupled with significant
        expertise in cloud services and DevOps practices.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        My proficiency in building robust solutions using <strong>Angular, React, and Node.js</strong>, complemented by
        a deep understanding of backend frameworks such as <strong>Express, Fastify, NestJS</strong>, and data
        management with both SQL (<strong>MySQL, PostgreSQL</strong>) and NoSQL (<strong>MongoDB, Cosmos DB</strong>)
        databases, allows me to contribute immediately to complex development challenges.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        I have extensive experience with <strong>AWS</strong> (Lambda, API Gateway, S3, DynamoDB) and <strong>Azure</strong> (Azure Functions, Blob Storage),
        building scalable serverless architectures and microservices. I'm also well-versed in <strong>Infrastructure-as-Code (IaC)</strong>
        with <strong>CloudFormation</strong> and <strong>Azure DevOps</strong>, ensuring seamless deployment workflows.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        My strong track record includes integrating APIs, optimizing application performance, and
        automating CI/CD pipelines using tools like <strong>AWS CodePipeline</strong> and <strong>Azure DevOps</strong>.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        I've thrived in Agile and hybrid Waterfall environments, effectively bridging the gap between technical challenges
        and business goals. My work with the <strong>Government of Alberta, GSTS, and IBM</strong> has helped me deliver secure, scalable, and innovative solutions.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        I am excited about bringing my experience, passion, and technical leadership to your organization.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        Thank you for your time and consideration. I look forward to the opportunity to discuss how my
        skills and experience align with your needs.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        Please find my attached resume for your review. Feel free to reach out to me at any time via the contact information below.
      </p>
      <p style="font-size:1rem; line-height:1.7;">
        Yours sincerely,<br/>
        <strong style="font-size:1.1rem;">Vikram Kumar</strong><br/>
        📞 +1-825-882-2199<br/>
        📧 vikcanada90@gmail.com
      </p>
    </div>
  </div>
  `;
}
