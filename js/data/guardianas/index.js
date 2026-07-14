/* ============================================================
   Agregador de guardianas — une todas las voluntarias.
   Agregar una guardiana nueva = crear su archivo (personaje +
   lista de casos + escenarios) y sumarla aquí.
   ============================================================ */

const GUARDIANAS = [valentinaGuardiana, sofiaGuardiana];

const CASES_BY_GUARDIANA = {
  valentina: valentinaCases,
  sofia: sofiaCases,
};

const SCENARIOS = {
  ...valentinaScenarios,
  ...sofiaScenarios,
};
