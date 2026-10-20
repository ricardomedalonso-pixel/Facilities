import { Incident, EmailAlert, CriticidadeNivel } from '../types/facilities';

export const DEFAULT_ALERT_EMAIL = 'ricardomedalonso@gmail.com';
export const DEFAULT_CC_EMAILS = [
  'facilities.ccm@shopee.com',
  'plantao.operacoes@cushwake.com'
];

export function getSlaHoursByCriticidade(criticidade: CriticidadeNivel): number {
  switch (criticidade) {
    case 1:
      return 4; // C1 Emergência Crítica: 4 horas
    case 2:
      return 12; // C2 Alta: 12 horas
    case 3:
      return 24; // C3 Média: 24 horas
    case 4:
      return 48; // C4 Baixa: 48 horas
    case 5:
      return 72; // C5 Programada: 72 horas
    default:
      return 24;
  }
}

export function formatDateTimeBR(dateStr?: string): string {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return dateStr || '';
  }
}

/**
 * Gera o texto no modelo exato padrão solicitado:
 * Informações organizadas e facilitar o atendimento pela Central. 🚨
 * 🚨 ACIONAMENTO CENTRAL CW
 * HUB/SOC/FULL: ...
 * Descrição do serviço: ...
 * Urgência: ...
 * Contato local: SL/Líder: ...
 * Contato mantenedora/SPOT: ...
 */
export function generateCentralCwAcionamentoText(incident: Incident): string {
  const slaHours = getSlaHoursByCriticidade(incident.criticidade);
  const hubSocFullTexto =
    incident.hub_soc_full ||
    `${incident.tipo_ativo_operacional || 'FULL'} - ${incident.unidade}`;
  const servicoTexto =
    incident.descricao_servico ||
    incident.descricao_ocorrencia ||
    incident.descricao;
  const urgenciaTexto =
    incident.urgencia ||
    `C${incident.criticidade} (${incident.faixa_criticidade || 'Crítico'}) - Meta SLA: ${slaHours}h`;
  const contatoLocalTexto =
    incident.contato_local ||
    `${incident.solicitante}`;
  const contatoMantenedoraTexto =
    incident.contato_mantenedora ||
    `${incident.fornecedor || 'Cushman & Wakefield Plantão 24h'}`;

  return `Informações organizadas e facilitar o atendimento pela Central. 🚨

🚨 ACIONAMENTO CENTRAL CW

HUB/SOC/FULL:
${hubSocFullTexto}

Descrição do serviço:
${servicoTexto}

Urgência: 
${urgenciaTexto}

Contato local: SL/Líder:
${contatoLocalTexto}

Contato mantenedora/SPOT:
${contatoMantenedoraTexto}`;
}

export function generateEmailHtml(incident: Incident, alertEmail: string, ccEmails: string[]): string {
  const slaHours = getSlaHoursByCriticidade(incident.criticidade);
  const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const criticidadeColor =
    incident.criticidade === 1
      ? '#DC2626'
      : incident.criticidade === 2
      ? '#EA580C'
      : incident.criticidade === 3
      ? '#D97706'
      : incident.criticidade === 4
      ? '#2563EB'
      : '#64748B';

  const criticidadeLabel =
    incident.criticidade === 1
      ? 'C1 - CRÍTICO (PARADA OU RISCO OPERACIONAL)'
      : incident.criticidade === 2
      ? 'C2 - ALTO (IMPACTO ELEVADO NA EXPEDIÇÃO)'
      : incident.criticidade === 3
      ? 'C3 - MÉDIO (MONITORAMENTO OPERACIONAL)'
      : incident.criticidade === 4
      ? 'C4 - BAIXO (SERVIÇO ROTINEIRO)'
      : 'C5 - PROGRAMADO / PREVENTIVA';

  const hubSocFullTexto =
    incident.hub_soc_full ||
    `${incident.tipo_ativo_operacional || 'FULL'} - ${incident.unidade}`;
  const servicoTexto =
    incident.descricao_servico ||
    incident.descricao_ocorrencia ||
    incident.descricao;
  const urgenciaTexto =
    incident.urgencia ||
    `C${incident.criticidade} (${incident.faixa_criticidade || 'Crítico'}) - Meta SLA: ${slaHours}h`;
  const contatoLocalTexto =
    incident.contato_local ||
    `${incident.solicitante}`;
  const contatoMantenedoraTexto =
    incident.contato_mantenedora ||
    `${incident.fornecedor || 'Cushman & Wakefield Plantão 24h'}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Acionamento Central CW - ${incident.protocolo}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 680px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
    
    <!-- Top Header Branding -->
    <div style="background-color: #0b1329; padding: 16px 24px; border-bottom: 3px solid #EE4D2D;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="left" style="vertical-align: middle;">
            <div style="display: inline-block; background-color: #ffffff; padding: 4px 10px; border-radius: 6px;">
              <span style="font-weight: 800; font-size: 18px; color: #EE4D2D; letter-spacing: -0.5px;">Shopee</span>
              <span style="font-size: 11px; color: #475569; font-weight: 600; margin-left: 4px;">FACILITIES</span>
            </div>
          </td>
          <td align="right" style="vertical-align: middle;">
            <div style="display: inline-block; background-color: #ffffff; padding: 4px 10px; border-radius: 6px;">
              <span style="font-weight: 700; font-size: 11px; color: #1e293b;">Cushman & Wakefield</span>
              <span style="display: block; font-size: 9px; color: #64748b; text-transform: uppercase;">Gestão Predial & Central CW</span>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Alert Urgency Banner -->
    <div style="background-color: ${criticidadeColor}; color: #ffffff; padding: 14px 24px; text-align: left;">
      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9;">
        ALERTA OPERACIONAL DE FACILITIES · DISPARO AUTOMÁTICO
      </div>
      <div style="font-size: 18px; font-weight: 800; margin-top: 2px;">
        🚨 Novo Acionamento Registrado: ${incident.protocolo}
      </div>
      <div style="display: inline-block; background-color: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-top: 6px;">
        Prioridade: ${criticidadeLabel} · SLA Meta: ${slaHours}h
      </div>
    </div>

    <!-- DEDICATED MODEL CARD: ACIONAMENTO CENTRAL CW -->
    <div style="background-color: #fff7ed; border: 2px solid #ea580c; border-radius: 10px; padding: 18px 20px; margin: 20px 24px 0 24px; box-shadow: 0 2px 8px rgba(234,88,12,0.08);">
      <div style="border-bottom: 2px solid #fed7aa; padding-bottom: 10px; margin-bottom: 14px;">
        <div style="font-size: 11px; color: #c2410c; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
          Informações organizadas e facilitar o atendimento pela Central. 🚨
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #9a3412; margin-top: 4px;">
          🚨 ACIONAMENTO CENTRAL CW
        </div>
      </div>

      <table width="100%" cellpadding="6" cellspacing="0" style="font-size: 13px; line-height: 1.5; color: #431407; border-collapse: collapse;">
        <tr>
          <td width="32%" style="font-weight: 700; color: #9a3412; vertical-align: top; border-bottom: 1px solid #ffedd5; padding: 8px 4px;">HUB/SOC/FULL:</td>
          <td style="font-weight: 700; color: #0f172a; border-bottom: 1px solid #ffedd5; padding: 8px 4px;">${hubSocFullTexto}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #9a3412; vertical-align: top; border-bottom: 1px solid #ffedd5; padding: 8px 4px;">Descrição do serviço:</td>
          <td style="color: #1e293b; border-bottom: 1px solid #ffedd5; padding: 8px 4px; line-height: 1.4;">${servicoTexto}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #9a3412; vertical-align: top; border-bottom: 1px solid #ffedd5; padding: 8px 4px;">Urgência:</td>
          <td style="font-weight: 800; color: #dc2626; border-bottom: 1px solid #ffedd5; padding: 8px 4px;">${urgenciaTexto}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #9a3412; vertical-align: top; border-bottom: 1px solid #ffedd5; padding: 8px 4px;">Contato local: SL/Líder:</td>
          <td style="color: #1e293b; border-bottom: 1px solid #ffedd5; padding: 8px 4px; font-weight: 600;">${contatoLocalTexto}</td>
        </tr>
        <tr>
          <td style="font-weight: 700; color: #9a3412; vertical-align: top; padding: 8px 4px;">Contato mantenedora/SPOT:</td>
          <td style="color: #1e293b; padding: 8px 4px; font-weight: 600;">${contatoMantenedoraTexto}</td>
        </tr>
      </table>
    </div>

    <!-- Body Container -->
    <div style="padding: 24px;">
      
      <!-- Summary Box -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 20px;">
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; width: 50%;">
            <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; display: block;">Unidade / Centro de Distribuição</span>
            <strong style="font-size: 14px; color: #0f172a;">${incident.unidade}</strong>
            <span style="font-size: 12px; color: #475569; display: block;">${incident.cidade} - ${incident.regiao}</span>
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; width: 50%;">
            <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; display: block;">Sistema & Equipamento</span>
            <strong style="font-size: 14px; color: #0f172a;">${incident.equipamento_afetado || incident.sistema}</strong>
            <span style="font-size: 12px; color: #475569; display: block;">Categoria: ${incident.sistema}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; width: 50%;">
            <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; display: block;">Solicitante Responsável</span>
            <strong style="font-size: 13px; color: #0f172a;">${incident.solicitante}</strong>
            <span style="font-size: 11px; color: #64748b; display: block;">Abertura: ${formatDateTimeBR(incident.data_hora_abertura || incident.data)}</span>
          </td>
          <td style="padding: 12px 16px; width: 50%;">
            <span style="font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; display: block;">Prazo Máximo de Normalização (SLA)</span>
            <strong style="font-size: 13px; color: ${criticidadeColor};">${slaDeadline} (${slaHours}h)</strong>
            <span style="font-size: 11px; color: #64748b; display: block;">Nº Ordem Manusis: ${incident.numero_manusis}</span>
          </td>
        </tr>
      </table>

      <!-- Action & Containment Block -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; font-size: 12px;">
        <tr>
          <td style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 12px 14px;">
            <strong style="color: #b45309; display: block; margin-bottom: 4px;">⚠️ Impacto Operacional / Ação Imediata:</strong>
            <span style="color: #78350f;">${incident.impacto_operacional || 'Impacto Operacional em avaliação pelo time de campo.'} - Ação: ${incident.acao_executada || 'Triagem inicial.'}</span>
          </td>
        </tr>
      </table>

      <!-- Execution / Supplier Assigned -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 6px; padding: 12px; margin-bottom: 24px; font-size: 12px; color: #334155;">
        <tr>
          <td>
            <strong>Fornecedor / Equipe Técnica Acionada:</strong> ${incident.fornecedor || 'Equipe Interna Facilities / C&W'}<br/>
            <strong>Contato SL / Líder:</strong> ${contatoLocalTexto}<br/>
            <strong>Notificação enviada para:</strong> <span style="color: #EE4D2D; font-weight: 600;">${alertEmail}</span> (Cópia: ${ccEmails.join(', ')})
          </td>
        </tr>
      </table>

      <!-- Action Button -->
      <div style="text-align: center; margin-bottom: 10px;">
        <a href="https://ais-dev-djpgqmw5m7nirbmkn4rotg-192872898274.us-east5.run.app" 
           style="display: inline-block; background-color: #EE4D2D; color: #ffffff; font-weight: 700; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 8px; box-shadow: 0 2px 6px rgba(238,77,45,0.3);">
          Acompanhar Chamado no Portal de Facilities & CCM
        </a>
      </div>
      <p style="text-align: center; font-size: 11px; color: #94a3b8; margin-top: 8px;">
        Este chamado foi registrado na Base Operacional oficial e sincronizado com a Central CW.
      </p>

    </div>

    <!-- Footer -->
    <div style="background-color: #0f172a; padding: 16px 24px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #334155;">
      <div style="color: #e2e8f0; font-weight: 600; margin-bottom: 4px;">
        Shopee Logistics & Facilities · Operação Cushman & Wakefield
      </div>
      <div>Central de Controle de Manutenção (CCM) · Monitoramento 24x7</div>
      <div style="margin-top: 6px; font-size: 10px; color: #64748b;">
        Mensagem gerada automaticamente pelo Sistema de Abertura de Chamados · ID: ${incident.id_automatico}
      </div>
    </div>

  </div>
</body>
</html>`;
}

export function generateEmailPlainText(incident: Incident, alertEmail: string, ccEmails: string[]): string {
  const cwAcionamento = generateCentralCwAcionamentoText(incident);
  const slaHours = getSlaHoursByCriticidade(incident.criticidade);
  const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000).toLocaleString('pt-BR');

  return `${cwAcionamento}

==================================================
METADADOS DE GOVERNANÇA & SISTEMA
==================================================
Protocolo: ${incident.protocolo}
Ordem Manusis: ${incident.numero_manusis}
Unidade / Localidade: ${incident.unidade} (${incident.cidade} - ${incident.regiao})
Sistema Afetado: ${incident.sistema}
Equipamento: ${incident.equipamento_afetado || incident.sistema}
SLA Limite: ${slaHours}h (Até: ${slaDeadline})
Data/Hora Registro: ${formatDateTimeBR(incident.data_hora_abertura || incident.data)}
Ação Imediata Operacional: ${incident.acao_executada || 'Triagem inicial e isolamento'}

--------------------------------------------------
DESTINATÁRIOS DO DISPARO
--------------------------------------------------
Destinatário Principal: ${alertEmail}
Cópia (CC): ${ccEmails.join(', ')}

Portal de Chamados Facilities & CCM:
https://ais-dev-djpgqmw5m7nirbmkn4rotg-192872898274.us-east5.run.app
`;
}

export function createMailtoUrl(incident: Incident, alertEmail: string, ccEmails: string[]): string {
  const hubSocFull = incident.hub_soc_full || `${incident.tipo_ativo_operacional || 'FULL'} - ${incident.unidade}`;
  const subject = `[ACIONAMENTO CENTRAL CW] ${incident.protocolo} - ${hubSocFull} - ${incident.equipamento_afetado || incident.sistema}`;
  const body = generateEmailPlainText(incident, alertEmail, ccEmails);
  
  const to = encodeURIComponent(alertEmail);
  const cc = encodeURIComponent(ccEmails.join(','));
  const sub = encodeURIComponent(subject);
  const bod = encodeURIComponent(body);

  return `mailto:${to}?cc=${cc}&subject=${sub}&body=${bod}`;
}
