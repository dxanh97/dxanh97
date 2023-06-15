'use client';

import React, { useEffect } from 'react';
import { FiGithub, FiMail, FiLinkedin } from 'react-icons/fi';

import css from './About.module.scss';
import Section from '../Section';

const About: React.FC<{
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  introduction: string;
}> = ({ name, role, email, github, linkedin, introduction }) => {
  const contactList = [
    { href: email, icon: <FiMail /> },
    { href: github, icon: <FiGithub /> },
    { href: linkedin, icon: <FiLinkedin /> },
  ];

  useEffect(() => {
    document
      .getElementById('yoe')
      ?.appendChild(
        document.createTextNode(`${new Date().getFullYear() - 2018}`),
      );
  }, []);

  return (
    <>
      <div className={css['wrapper']}>
        <div className={css['box']}>
          <div className={css['content']}>
            <h1 className={css['name']}>
              {name.split(' ').map((x) => (
                <React.Fragment key={x}>
                  {x}
                  <br />
                </React.Fragment>
              ))}
            </h1>
            <div className={css['title']}>
              <span>{role}</span>
            </div>
            <div className={css['contact-wrapper']}>
              {contactList.map((contact) => (
                <a
                  key={contact.href}
                  target="_blank"
                  rel="noreferrer"
                  href={contact.href}
                >
                  {contact.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Section header="About">
        <div dangerouslySetInnerHTML={{ __html: introduction }} />
      </Section>
    </>
  );
};

export default About;
