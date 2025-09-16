"use client";

import Card from "../common/Card";
import styles from "./hero.module.css";

const HeroFloatingCards = ({ model }) => {
  return (
    <>
      {/* Meeting Card */}
      <div className={styles.frameParent}>
        <div data-reveal="scale" data-reveal-delay="0.15" data-parallax="0.65">
          <Card variant="floating" className={styles.meetingCard}>
            <div className={styles.tagParent}>
              <div className={styles.tag}>
                <img
                  className={styles.calendarTodayIcon}
                  alt="Calendar icon"
                  src="/homepage/calendar_today.svg"
                />
                <div className={styles.text}>{model.cards.meeting.heading}</div>
              </div>
              <div className={styles.reuninConCliente}>
                {model.cards.meeting.title}
              </div>
            </div>
            <div className={styles.martes27Parent}>
              <div className={styles.am}>{model.cards.meeting.date}</div>
              <div className={styles.am}>{model.cards.meeting.time}</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Task Card */}
      <div className={styles.HeroInner}>
        <div data-reveal="scale" data-reveal-delay="0.30" data-parallax="0.70">
          <Card variant="floating" className={styles.taskCard}>
            <div className={styles.tagGroup}>
              <div className={styles.tag1}>
                <img
                  className={styles.articleIcon}
                  alt="List icon"
                  src="/homepage/article.svg"
                />
                <div className={styles.text}>{model.cards.lists.heading}</div>
              </div>
              <div className={styles.tusTareasPendientes}>
                {model.cards.lists.title}
              </div>
              <div className={styles.pasearAPacoContainer}>
                <ul className={styles.pasearAPacoHacerLasCo}>
                  {model.cards.lists.items.map((item, index) => (
                    <li
                      key={index}
                      className={index < 2 ? styles.pasearAPaco : ""}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Reminder Card */}
      <div className={styles.reminderCard}>
        <div data-reveal="scale" data-reveal-delay="0.45" data-parallax="0.60">
          <Card variant="floating" className={styles.reminderCardContent}>
            <div className={styles.tagParent}>
              <div className={styles.tag2}>
                <img
                  className={styles.calendarTodayIcon}
                  alt="Reminder icon"
                  src="/homepage/calendar_today-1.svg"
                />
                <div className={styles.text}>
                  {model.cards.reminder.heading}
                </div>
              </div>
              <div className={styles.reuninConCliente}>
                {model.cards.reminder.title}
              </div>
            </div>
            <div className={styles.martes27Parent}>
              <div className={styles.am}>{model.cards.reminder.date}</div>
              <div className={styles.am}>{model.cards.reminder.time}</div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default HeroFloatingCards;
