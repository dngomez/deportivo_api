import { createTransport } from 'nodemailer'

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'cdeportivoaura@gmail.com',
    pass: 'rejwwwramgrfpvmg'
  }
})

export const SIGNATURE = `
<span style="color: rgb(0, 153, 153); font-weight: bold;">Este mensaje ha sido generado automáticamente.</span>
<table>
  <tbody>
    <tr>
      <td>
        <span style="color: rgb(0, 153, 153); display: block; text-align:center;">Club deportivo y cultural</span>
        <span style="color: rgb(0, 153, 153); display: block; text-align:center; font-size: 1.8rem; font-weight: bolder; letter-spacing: 0.6rem;">AURA</span>
      </td>
      <td>
        <img src='cid:logo' width="80"></img>
      </td>
    </tr>
  </tbody>
</table>
`

export function sendEmail(to, subject, message) {
  transporter.sendMail({
    from: 'cdeportivoaura@gmail.com',
    to: to,
    subject: `${subject} [www.cdeportivoaura.cl]`,
    attachments: [{
      filename: "logo.png",
      path: "./src/img/light_logo.png",
      cid: 'logo'
    }],
    html: `${message}<br>${SIGNATURE}`
  }, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      // do something useful
    }
  })
}