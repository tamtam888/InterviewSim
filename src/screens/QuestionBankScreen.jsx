import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLanguage } from "../i18n/useLanguage";
import { ROLES } from "../data/roles";
import { ALL_QUESTIONS } from "../data/questions";
import RoleIcon from "../components/RoleIcon";
import "../styles/QuestionBankScreen.css";

const TYPE_LABEL_KEYS = {
  technical: "typeTechnical",
  hr: "typeHr",
  behavioral: "typeBehavioral",
};

function QuestionItem({ question }) {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <li className="card qb-item">
      <button
        type="button"
        className="qb-item-head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={`pill question-type-pill type-${question.type}`}>
          {t(TYPE_LABEL_KEYS[question.type])}
        </span>
        <span className="qb-item-text">{question.text[lang]}</span>
        {open ? <ChevronUp size={17} aria-hidden="true" /> : <ChevronDown size={17} aria-hidden="true" />}
      </button>
      {open && (
        <div className="qb-item-body">
          <p className="qb-item-tip">
            <strong>{t("tipLabel")}:</strong> {question.tip[lang]}
          </p>
          <p className="qb-item-model">{question.model[lang]}</p>
        </div>
      )}
    </li>
  );
}

export default function QuestionBankScreen() {
  const { t, lang } = useLanguage();
  const [roleId, setRoleId] = useState("frontend");

  const { roleQuestions, sharedQuestions } = useMemo(() => {
    const role = ALL_QUESTIONS.filter((q) => q.role === roleId);
    const shared = ALL_QUESTIONS.filter((q) => !q.role);
    return { roleQuestions: role, sharedQuestions: shared };
  }, [roleId]);

  return (
    <main className="screen container question-bank">
      <header className="screen-head">
        <h1 className="section-title">{t("qbTitle")}</h1>
        <p className="screen-subtitle">{t("qbSubtitle")}</p>
      </header>

      <div className="qb-role-chips">
        {ROLES.map((role) => (
          <button
            type="button"
            key={role.id}
            className={`role-chip ${roleId === role.id ? "is-active" : ""}`}
            aria-pressed={roleId === role.id}
            onClick={() => setRoleId(role.id)}
          >
            <RoleIcon name={role.icon} size={15} />
            <span>{role.name[lang]}</span>
          </button>
        ))}
      </div>

      <ul className="qb-list">
        {roleQuestions.map((q) => (
          <QuestionItem key={q.id} question={q} />
        ))}
      </ul>

      <p className="qb-shared-note">{t("qbSharedNote")}</p>
      <ul className="qb-list">
        {sharedQuestions.map((q) => (
          <QuestionItem key={q.id} question={q} />
        ))}
      </ul>
    </main>
  );
}
