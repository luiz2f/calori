const emailHeader = ` 
<!doctype html>
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
      #body {
        font-family: 'Inter', Arial, sans-serif;
        margin: 0;
        padding: 0;
      }
      h1 {
        font-weight: 400;
        font-size: 20px;
        margin: 32px 0;
        text-align: center;
        color: black;
      }
      p {
        color: #585858;
        font-size: 16px;
        margin: 0;
      }
      img {
        display: flex;
        margin: 0 auto;
      }
      #button {
        background-color: #76c163;
        color: white;
        width: 100%;
        font-size: 1.25rem;
        border-radius: 0.5rem;
        border: 1px solid;
        font-weight: 400;
        margin-top: 24px;
        margin-bottom: 32px;
        display: block;
        width: -webkit-fill-available;
        text-align: center;
        vertical-align: revert;
        height: fit-content;
        padding: 14px;
        max-width: 389px;
      }
      .email-container {
        max-width: 389px;
        margin: 48px auto;
        padding: 48px;
        background: #ffffff;
        border: 1px solid #e2e2e2;
        border-radius: 0.5rem;
      }
      .email-header {
        text-align: center;
        color: #333;
      }

      .email-footer {
        border-top: 1px solid #e2e2e2;
        font-size: 12px;
        margin-top: 20px;
      }
      .email-footer p {
        margin-top: 20px;
        margin-bottom: 0;
        font-size: 12px;
      }
      a {
        text-decoration: none;
      }
    </style>
  </head>
  <div id="body">
    <div class="email-container">
      <img width="100"
        src="https://raw.githubusercontent.com/luiz2f/calori/refs/heads/main/public/logo.png"
        alt="Calori Logo"/>
  `
const emailFooter = `<div class="email-footer">
        <p>Calori <a href="#">calorii.vercel.app</a></p>
      </div>
    </div>
  </div id="body">
</html>`

const verificationBody = (link: string) => {
  return ` <div class="email-body">
        <h1>Verificação de Conta</h1>
        <div class="content">
          <p>
            Olá, estamos quase lá. Clique no botão abaixo para confirmar seu
            e-mail e ativar sua conta:
          </p>
        </div>
        <a id="button" href="${link}" target="_blank">Verificar Conta</a>
        <p>Se você não criou essa conta, pode ignorar este email.</p>
      </div>`
}
const passwordBody = (link: string) => {
  return `<div class="email-body">
        <h1>Redefinição de Senha</h1>
        <div class="content">
          <p>
            Uma solicitação de redefinição de senha foi feita para o e-mail
            cadastrado.<br /><br />Clique no botão abaixo para prosseguir
          </p>
        </div>
        <a id="button" href="${link}" target="_blank">Redefinir senha</a>
        <p>
          Se você não deseja redefinir sua senha ou não solicitou estas
          informações, pode ignorar este email com segurança.
        </p>
      </div>`
}

const emailBodyByType: {
  verification: (link: string) => string
  password: (link: string) => string
} = {
  verification: verificationBody,
  password: passwordBody
}

export default function emailFormat(
  type: 'verification' | 'password',
  link: string
) {
  const emailBody = emailBodyByType[type](link)

  const htmlContent = `${emailHeader}${emailBody}${emailFooter}`
  return htmlContent
}
