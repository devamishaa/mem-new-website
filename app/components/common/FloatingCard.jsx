import styles from "./floatingcard.module.css";

// Pill component for the pill section
function Pill({ pill }) {
  if (!pill) return null;

  return (
    <div className={styles.pill}>
      {pill.icon && <img className={styles.pillIcon} alt="" src={pill.icon} />}
      <div className={styles.pillText}>{pill.text}</div>
    </div>
  );
}

// List component for the list section
function List({ list }) {
  if (!list) return null;

  return (
    <div>
      <ul className={styles.list}>
        {list.map((item, i) => (
          <li key={i} className={i < 2 ? styles.listItem : ""}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Meta component for the meta section
function Meta({ meta }) {
  if (!meta) return null;

  return (
    <div className={styles.meta}>
      <div className={styles.metaItem}>{meta.date}</div>
      <div className={styles.metaItem}>{meta.time}</div>
    </div>
  );
}

// WhatsApp UI component
function WhatsAppUI({ whatsappUI }) {
  if (!whatsappUI) return null;

  return <div className={styles.whatsappContainer}>{whatsappUI}</div>;
}

// Main FloatingCard component
export default function FloatingCard({
  pill,
  title,
  list,
  meta,
  subtitle,
  content,
  listTitle,
  whatsappUI,
  testimonial,
  children,
}) {
  if (children) return <>{children}</>;

  return (
    <>
      <Pill pill={pill} />
      {title && <div className={styles.title}>{title}</div>}
      <List list={list} />
      <Meta meta={meta} />
      <WhatsAppUI whatsappUI={whatsappUI} />
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      {content && <div className={styles.content}>{content}</div>}
      {listTitle && <p className={styles.listTitle}>{listTitle}</p>}
    </>
  );
}
