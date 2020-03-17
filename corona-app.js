let e = null,
	t = null,
	n = null
const a = 'https://forms.gle/CghwQGaTjzRmxg4C8',
	i = new (function() {
		let e = this
		;(this.countries = new G()),
			(this.cookies = new U()),
			(this.cookieName = 'ytoken'),
			(this.xToken = null),
			(this.yToken = null),
			(this.find = function() {
				let t = document.querySelector('body')
				e.xToken = t.getAttribute('data-a')
				let n = t.getAttribute('data-b')
				e.cookies.set(e.cookieName, n, 9999),
					t.removeAttribute('data-a'),
					t.removeAttribute('data-b')
			}),
			e.find(),
			(this.header = function() {
				let t = e.cookies.get(e.cookieName)
				return { [t]: e.xToken }
			}),
			(this.reloadCurrent = function() {}),
			(this.getCheckpoints = async function(t) {
				try {
					let t = await O('GET', '/get-checkpoints', null, e.header()),
						n = t.data || []
					return e.parseEntities(n, 'date'), n
				} catch (e) {
					new y({ msg: 'Unknown error loading data' })
				}
			}),
			(this.getPlaces = async function() {
				try {
					let t = await O('GET', '/get-places', null, e.header()),
						n = (JSON.parse(JSON.stringify(t)), t.data || []),
						a = e.buildMasterRegions(n, [])
					return e.parseEntities(a, 'lastUpdated'), a
				} catch (e) {
					new y({ msg: 'Unknown error loading data' })
				}
			}),
			(this.buildMasterRegions = function(t, n) {
				t.forEach(function(a) {
					if (a.isMaster) return
					let i = n.find(e => e.country === a.country),
						o = parseInt(a.infected || 0),
						r = parseInt(a.sick || 0),
						s = parseInt(a.dead || 0),
						d = parseInt(a.recovered || 0),
						l = a.lastUpdated,
						u = e.countries.longitude(a.country) || a.longitude,
						m = e.countries.zoom(a.country) || 3,
						p = e.countries.latitude(a.country) || a.latitude
					if ('number' != typeof o) return
					i
						? ((i.longitude = o > i.infected ? u : i.longitude),
						  (i.latitude = o > i.infected ? p : i.latitude),
						  (i.infected += o),
						  (i.recovered += d),
						  (i.dead += s),
						  (i.sick += r),
						  (i.subregions += 1),
						  (i.lastUpdated = c.compare(l, i.lastUpdated) ? l : i.lastUpdated))
						: n.push({
								country: a.country,
								name: e.countries.name(a.country),
								id: a.country,
								infected: o,
								recovered: d,
								dead: s,
								sick: r,
								subregions: 1,
								isMaster: !0,
								lastUpdated: a.lastUpdated,
								longitude: u,
								latitude: p,
								zoom: m
						  })
					let h = t.filter(function(e) {
						return e.country === a.country
					})
					h.length > 1 && ((a.isSub = !0), (a.zoom = m))
				})
				let a = n.filter(function(e) {
						return e.subregions > 1
					}),
					i = t.concat(a)
				return i
			}),
			(this.getHistory = async function(t) {
				try {
					let n = await O('GET', '/get-history?id=' + t, null, e.header()),
						a = n.data || []
					return (
						a.history.forEach(function(t) {
							e.parseEntity(t)
						}),
						a.history.sort(v('day')),
						a
					)
				} catch (t) {
					e.reloadCurrent()
				}
			}),
			(this.parseEntities = function(t, n, a) {
				return t
					? t.length < 1
						? t
						: (t.forEach(function(t, n) {
								e.parseEntity(t)
						  }),
						  t.sort(v(n)),
						  void (a && t.reverse()))
					: []
			}),
			(this.parseEntity = function(t) {
				if (!t) return {}
				;(t.infected = parseInt(t.infected) || 0),
					(t.dead = parseInt(t.dead) || 0),
					(t.recovered = parseInt(t.recovered) || 0),
					e.calculateSick(t),
					e.calculateFatalityRate(t),
					e.calculateRecoveryRate(t)
			}),
			(this.calculateFatalityRate = function(e) {
				let t = e.dead,
					n = e.infected,
					a = ((t / n) * 100 || 0).toFixed(2) || 0
				isFinite(a) || (a = (0).toFixed(2)), (e.fatalityRate = parseFloat(a))
			}),
			(this.calculateRecoveryRate = function(e) {
				let t = e.recovered,
					n = e.infected,
					a = ((t / n) * 100 || 0).toFixed(2) || 0
				isFinite(a) || (a = (0).toFixed(2)), (e.recoveryRate = parseFloat(a))
			}),
			(this.calculateSick = function(e) {
				;(e.sick =
					parseInt(e.infected || 0) -
					parseInt(e.dead || 0) -
					parseInt(e.recovered || 0)),
					e.sick < 0 && (e.sick = 0)
			}),
			(this.init = function() {
				navigator.cookieEnabled ||
					new S('You must enable cookies for this app to work').render()
			}),
			this.init()
	})(),
	o = new (function() {
		let e = this
		;(this.options = ['EN', 'TW', 'FR', 'KR', 'DE', 'IT', 'ES', 'HU']),
			(this.lang = null),
			(this.countries = new G()),
			(this.cookies = new U()),
			(this.cookieName = 'lang'),
			(this.attributions = {
				DE:
					'German translation by Matthias Schaffer, Fiona Georgia, Benni Neubacher, Miszel Brzakalik, Stephan Crummenauer, Laura Hoffmann, Mike Hahn, Henri Hollmann, Manuel Lapuente Gonzalez, Christian Chvala',
				IT:
					'Italian translation by Alessandro Palazzesi, Lorenzo Geromel, Ester Memoli, Lorenzo Di Capua',
				ES:
					'Spanish translation by Luis Astorquiza, Wilmar Echeverry, Julio Gustavo Bustamante Mera, Mateo Llera, Alejandro Ortiz Obregon, Gerard López López, Jesus Antonio Castro, David Domínguez Martínez, Daniel Ramos, Joana Fernández, Frederick Ferro, Hugo Villegas, Timothy Arce, Francisco Javier Rojas, Andrés Aguirre, Ismael Jorge HP, Carlos Ivan Rivera Avalos, Julia Manuela Rizo, Laura Rivas, Luis G. Corral, Pablo de Andres, Fernando Sancho, Hector A Lopez Rdz, Sebastián Haddad, Darwin Josue Pilaloa Zea, Alexis Noria, Jonathan Vargas Vargas, Luisa Fernanda Vaca Correa, Ferney Palacio, Sergio Nicolás Melo Torres ',
				HU: 'Hungarian translation by Nagy Adam, Attila Böjte, Lili Repkó'
			}),
			(this.map = {
				LI: 'DE',
				AT: 'DE',
				CH: 'FR',
				BE: 'FR',
				CD: 'FR',
				MX: 'ES',
				CO: 'ES',
				AR: 'ES',
				PE: 'ES',
				VE: 'ES',
				CL: 'ES',
				EC: 'ES',
				GT: 'ES',
				CU: 'ES',
				BO: 'ES',
				DO: 'ES',
				HN: 'ES',
				PY: 'ES',
				SV: 'ES',
				NI: 'ES',
				CR: 'ES',
				PA: 'ES',
				UY: 'ES',
				GQ: 'ES'
			}),
			(this.getAttribution = function() {
				return e.attributions[e.lang]
			}),
			(this.set = function(t) {
				e.options.includes(t) &&
					((e.lang = t), e.cookies.set(e.cookieName, t, 9999), m.rerender())
			}),
			(this.init = function() {
				e.updateTime()
				let t = e.cookies.get(e.cookieName),
					n = e.getCountry(),
					a = t || e.map[n] || n
				e.lang = a && e.options.includes(a) ? a : e.options[0]
			}),
			(this.getCountry = function() {
				return document.querySelector('body').getAttribute('data-country')
			}),
			(this.getENCountry = function() {
				let t = e.getCountry()
				return ['GB', 'CA', 'IE', 'NZ', 'AU', 'ZA'].includes(t) ? t : 'US'
			}),
			(this.getESCountry = function() {
				let t = e.getCountry()
				return [
					'MX',
					'CO',
					'AR',
					'PE',
					'VE',
					'CL',
					'EC',
					'GT',
					'CU',
					'BO',
					'DO',
					'HN',
					'PY',
					'SV',
					'NI',
					'CR',
					'PA',
					'UY',
					'GQ'
				].includes(t)
					? t
					: 'ES'
			}),
			(this.selector = function(t) {
				let n = document.createElement('div')
				n.classList.add('language-selector-inner'),
					n.addEventListener('click', function() {
						e.modal(n)
					}),
					t.appendChild(n)
				let a = document.createElement('div')
				a.classList.add('language-selector-button'), n.appendChild(a)
				let i = document.createElement('img')
				i.setAttribute('src', e.languageFlag(e.lang)), a.appendChild(i)
				let o = document.createElement('span')
				o.classList.add('language-selector-title'),
					(o.textContent = e.languageName(e.lang)),
					a.appendChild(o)
			}),
			(this.languageName = function(t) {
				return 'EN' === t ? 'English' : e.countries.language(t)
			}),
			(this.languageFlag = function(t) {
				return 'EN' === t
					? e.countries.flag(e.getENCountry())
					: 'ES' === t
					? e.countries.flag(e.getESCountry())
					: e.countries.flag(t)
			}),
			(this.openTranslateForm = function() {
				window.open('https://forms.gle/4JRG5zBh13drMUa86', '_blank')
			}),
			(this.clickOnLanguageItem = function(t) {
				'translate' === t ? e.openTranslateForm() : e.set(t)
			}),
			(this.modal = function(t) {
				let n = []
				e.options.forEach(function(t) {
					n.push({ img: e.languageFlag(t), name: e.languageName(t), value: t })
				}),
					n.push({
						icon: 'fa fa-language',
						name: function() {
							return E('translateThisApp')
						},
						value: 'translate'
					}),
					new C(t, e.clickOnLanguageItem, n, 'Language')
			}),
			(this.updateTime = function() {
				moment.locale('HU', {
					relativeTime: {
						future: 'ben %s',
						past: 'ezelőtt %s',
						s: 'pár másodperce',
						ss: '%d másodperce',
						m: 'egy perce',
						mm: '%d perce',
						h: 'egy órája',
						hh: '%d órája',
						d: 'egy nap',
						dd: '%d napja',
						M: 'egy hónapja',
						MM: '%d hónapja',
						y: 'egy éve',
						yy: '%d éve'
					}
				}),
					moment.locale('ES', {
						relativeTime: {
							future: 'en %s',
							past: '%s atrás',
							s: 'unos pocos segundos',
							ss: '%d segundos',
							m: 'un minuto',
							mm: '%d minutos',
							h: 'una hora',
							hh: '%d horas',
							d: 'un día',
							dd: '%d días',
							M: 'un mes',
							MM: '%d meses',
							y: 'un año',
							yy: '%d años'
						}
					}),
					moment.locale('IT', {
						relativeTime: {
							future: 'in %s',
							past: '%s fa',
							s: 'pochi secondi',
							ss: '%d secondi',
							m: 'un minuto',
							mm: '%d minuti',
							h: "un'ora",
							hh: '%d ore',
							d: 'un giorno',
							dd: '%d giorni',
							M: 'un mese',
							MM: '%d mesi',
							y: 'un anno',
							yy: '%d anni'
						}
					}),
					moment.locale('DE', {
						relativeTime: {
							future: 'in %s',
							past: 'vor %s',
							s: 'ein paar Sekunden',
							ss: '%d Sekunden',
							m: 'eine Minute',
							mm: '%d Minuten',
							h: 'eine Stunde',
							hh: '%d Stunden',
							d: 'einen Tag',
							dd: '%d Tage',
							M: 'ein Monat',
							MM: '%d Monate',
							y: 'ein Jahr',
							yy: '%d Jahre'
						}
					}),
					moment.locale('FR', {
						relativeTime: {
							future: 'dans %s',
							past: 'il y a %s',
							s: 'quelques secondes',
							ss: '%d secondes',
							m: 'une minute',
							mm: '%d minutes',
							h: 'une heure',
							hh: '%d heures',
							d: 'un jour',
							dd: '%d jours',
							M: 'un mois',
							MM: '%d mois',
							y: 'un an',
							yy: '%d ans'
						}
					}),
					moment.locale('TW', {
						relativeTime: {
							future: '%s内',
							past: '%s前',
							s: '几秒',
							m: '1分',
							mm: '%d分',
							h: '1小時',
							hh: '%d小時',
							d: '1天',
							dd: '%d天',
							M: '1個月',
							MM: '%d個月',
							y: '1年',
							yy: '%d年'
						}
					}),
					moment.locale('KR', {
						relativeTime: {
							future: '%s 후',
							past: '%s 전',
							s: '몇 초',
							m: '1분',
							mm: '%d분',
							h: '1시간',
							hh: '%d시간',
							d: '1일',
							dd: '%d일',
							M: '1달',
							MM: '%d달',
							y: '1년',
							yy: '%d년'
						}
					})
			}),
			this.init()
	})(),
	r = new (function() {
		;(this.replace = function(e, t) {
			for (var n = '/', a = 0; a < e.length && e[a]; a++)
				(n += e[a]), a < e.length - 1 && (n += '/')
			var i = { componentId: e[1] }
			e[2] && (i.objectId = e[2]),
				(n += window.location.search ? window.location.search : ''),
				t ? history.replaceState(i, '', n) : history.pushState(i, '', n)
		}),
			(this.getParam = function(e) {
				var t = new URLSearchParams(window.location.search),
					n = t.get(e)
				return n
			}),
			(this.get = function() {
				var e = window.location.pathname,
					t = e.split('/')
				return t[1]
			}),
			(this.resetParam = function() {
				window.history.replaceState(
					null,
					null,
					window.location.origin + window.location.pathname
				)
			}),
			(this.setParam = function(e) {
				var t = new URLSearchParams(window.location.search)
				for (var n of t.entries()) {
					var a = n[0],
						i = n[1],
						o = e[a]
					null === o ? delete e[a] : o || (e[a] = i)
				}
				var r = window.location.pathname + '?'
				for (x in e) e[x] && (r += x + '=' + e[x] + '&')
				var s = r.slice(-1)
				;('&' !== s && '?' !== s) || (r = r.slice(0, r.length - 1)),
					window.history.replaceState(null, null, r)
			})
	})(),
	s = new (function() {
		let e = this
		;(this.version = 200),
			(this.reg = null),
			(this.sw = function() {
				return window.location.origin + '/sw.js?v=' + e.version
			}),
			(this.init = function() {
				'serviceWorker' in navigator == !0 &&
					navigator.serviceWorker
						.register(e.sw())
						.then(function(t) {
							e.reg = t
						})
						.catch(function(e) {
							console.log(e)
						})
			}),
			this.init()
	})(),
	d = new (function() {
		let e = this
		;(this.list = []),
			(this.cache = []),
			(this.cacheable = [
				'/get-checkpoints',
				'/get-history',
				'/get-places',
				'/get-data',
				'/get-place-reports',
				'/get-place',
				'/get-report',
				'/get-taiwan-masks'
			]),
			(this.max = 15),
			(this.register = function(t, n, a) {
				if (e.cache.length > e.max) {
					let t = e.cache.length - 1,
						n = e.cache.length - 1 - e.max
					n < 0 && (n = 0), (e.cache = e.cache.slice(n, t))
				}
				e.cache.push({ route: t, promise: n, data: a })
			}),
			(this.isCacheable = function(t) {
				let n = null
				return (
					e.cacheable.forEach(function(e) {
						;(e === t || t.includes(e)) && (n = !0)
					}),
					n
				)
			}),
			(this.find = function(t, n) {
				let a = e.isCacheable(t)
				if (a)
					for (let a = 0; a < e.cache.length; a++) {
						let i = e.cache[a]
						if (i.route === t && (!n || i.data) && (n || !i.data)) {
							if (n) {
								let e = q(n, i.data)
								if (e) continue
							}
							return i.promise
						}
					}
				return null
			})
	})(),
	l =
		(new (function() {
			let e = this
			;(this.loadDate = moment().toISOString()),
				(this.timer = null),
				(this.displayAfter = 12e5),
				(this.element = null),
				(this.check = function() {
					let t = moment().diff(moment(e.loadDate))
					t > e.displayAfter && (e.render(), clearInterval(e.timer))
				}),
				(this.reloadPage = function() {
					location.reload(!0)
				}),
				(this.render = function() {
					;(e.element = document.createElement('div')),
						e.element.classList.add('backdrop'),
						document.querySelector('body').appendChild(e.element)
					let t = document.createElement('div')
					t.classList.add('update-reloader'),
						t.addEventListener('click', e.reloadPage),
						e.element.appendChild(t)
					let n = document.createElement('i')
					n.classList.add('fa', 'fa-redo-alt'), t.appendChild(n)
					let a = document.createElement('span')
					;(a.textContent =
						window.innerWidth > 991 ? 'Click to update' : 'Tap to update'),
						t.appendChild(a)
				}),
				(this.init = function() {
					e.timer = setInterval(function() {
						e.check()
					}, 1e3)
				}),
				this.init()
		})(),
		{
			map: {
				EN: 'Map',
				FR: 'Carte',
				TW: '地圖',
				KR: '지도',
				DE: 'Karte',
				IT: 'Mappa',
				ES: 'Mapa',
				HU: 'Térkép'
			},
			language: {
				EN: 'Language',
				TW: '語言',
				FR: 'Langue',
				KR: '언어',
				DE: 'Sprache',
				IT: 'Lingua',
				ES: 'Lenguaje',
				HU: 'Nyelv'
			},
			darkMode: {
				EN: 'Theme',
				FR: 'Thème',
				TW: '主題',
				KR: '테마',
				DE: 'Thema',
				IT: 'Tema',
				ES: 'Tema',
				HU: 'Téma'
			},
			preferences: {
				EN: 'Preferences',
				FR: 'Préférences',
				TW: '優先',
				DE: 'Einstellungen',
				IT: 'Preferenze',
				ES: 'Preferencias',
				HU: 'Preferenciák'
			},
			filterMap: {
				EN: 'Filter',
				FR: 'Filtrer',
				IT: 'Filtro',
				ES: 'Filtro',
				HU: 'Szűrő'
			},
			countries: {
				EN: 'Countries',
				FR: 'Pays',
				TW: '國家',
				KR: '국가',
				DE: 'Länder',
				IT: 'Paesi',
				ES: 'Países',
				HU: 'Országok'
			},
			global: {
				EN: 'Global',
				FR: 'Global',
				TW: '全球',
				KR: '글로벌',
				DE: 'Weltweit',
				IT: 'Globale',
				ES: 'Global',
				HU: 'Globális'
			},
			api: { EN: 'API' },
			translateThisApp: { EN: 'Help us translate!' },
			masks: { EN: 'Masks', FR: 'Masques', TW: '口罩', KR: '마스크' },
			searchRegions: {
				EN: 'Search regions',
				FR: 'Chercher une région',
				TW: '搜尋',
				KR: '지역 검색',
				DE: 'Suche nach Regionen',
				IT: 'Cerca regioni',
				ES: 'Buscar regiones',
				HU: 'Régió keresése'
			},
			name: {
				EN: 'Name',
				FR: 'Nom',
				TW: '名稱',
				KR: '이름',
				IT: 'Nome',
				ES: 'Nombre',
				HU: 'Név'
			},
			toll: {
				EN: 'Toll',
				FR: 'Bilan',
				TW: '數量',
				KR: '발생 현황',
				DE: 'Meldung',
				IT: 'Conto',
				ES: 'Peaje',
				HU: 'Díj'
			},
			lastUpdate: {
				EN: 'Last update',
				FR: 'Mise à jour',
				TW: '資料更新時間',
				KR: '최근 업데이트',
				DE: 'Letztes Update',
				IT: 'Ultimo aggiornamento',
				ES: 'Actualización',
				HU: 'Utolsó frissítés'
			},
			infected: {
				EN: 'Total cases',
				FR: 'Total des cas',
				TW: '感染病毒總數',
				KR: '총 확진자 수',
				DE: 'Gesamtfälle',
				IT: 'Casi totali',
				ES: 'Casos totales',
				HU: 'Összes eset'
			},
			recovered: {
				EN: 'Recovered',
				FR: 'Rétablis',
				TW: '治癒',
				KR: '완치자',
				DE: 'Geheilt',
				IT: 'Guariti',
				ES: 'Recuperados',
				HU: 'Gyógyult'
			},
			dead: {
				EN: 'Deceased',
				FR: 'Décédés',
				TW: '死亡',
				KR: '사망자',
				DE: 'Verstorben',
				IT: 'Morti',
				ES: 'Muertos',
				HU: 'Elhunyt'
			},
			sick: {
				EN: 'Currently Sick',
				FR: 'Malades',
				TW: '目前感染',
				KR: '실시간 확진자',
				DE: 'Derzeit krank',
				IT: 'Malati attuali',
				ES: 'Enfermos',
				HU: 'Jelenleg beteg'
			},
			adultMasks: {
				EN: 'Adult masks',
				FR: 'Masques pour adultes',
				TW: '成人口罩剩餘數',
				KR: '성인용 마스크'
			},
			childMasks: {
				EN: 'Child masks',
				FR: 'Masques pour enfants',
				TW: '兒童口罩剩餘數',
				KR: '어린이용 마스크'
			},
			addMissingRegion: {
				EN: 'Add region',
				FR: 'Ajouter une région',
				TW: '回報病例',
				KR: '누락된 지역 추가하기',
				DE: 'Region hinzufügen',
				IT: 'Aggiungi regione',
				ES: 'Añadir Región',
				HU: 'Régió hozzáadása'
			},
			embed: {
				EN: 'Embed',
				FR: 'Intégrer',
				TW: '嵌入',
				KR: '임베드',
				DE: 'Einbetten',
				IT: 'Incorpora',
				ES: 'Integrar',
				HU: 'Beágyazott'
			},
			contactUs: {
				EN: 'Contact us',
				FR: 'Nous contacter',
				TW: '聯絡我們',
				KR: '개발진에게 연락하기',
				DE: 'Kontaktiere uns',
				IT: 'Contattaci',
				ES: 'Contáctanos',
				HU: 'Kapcsolatfelvétel'
			},
			creditsAndSources: {
				EN: 'Credits & sources',
				FR: 'Sources et crédits',
				TW: '資料來源',
				KR: '출처와 개발진',
				DE: 'Credits & Quellen',
				IT: 'Crediti e Fonti',
				ES: 'Créditos y Fuentes',
				HU: 'Hitelek és források'
			},
			fatalityRate: {
				EN: 'Fatality rate',
				FR: 'Taux de létalité',
				TW: '死亡率',
				KR: '치사율',
				DE: 'Sterblichkeitsrate',
				IT: 'Tasso di mortalità',
				ES: 'Tasa de mortalidad',
				HU: 'Halálozási arány'
			},
			recoveryRate: {
				EN: 'Recovery rate',
				FR: 'Taux de rétablissement',
				TW: '治癒率',
				KR: '완치율',
				DE: 'Heilungsrate',
				IT: 'Tasso di guarigione',
				ES: 'Tasa de recuperación',
				HU: 'Gyógyulási arány'
			},
			totalInfectedByCoronavirus: {
				EN: 'Total cases of coronavirus',
				FR: 'Total de cas de coronavirus',
				TW: '病毒感染確診總數',
				KR: '총 확진자 수',
				DE: 'Gesamt am Coronavirus infizierte',
				IT: 'Infettati totale da coronavirus',
				ES: 'Total infectado por coronavirus',
				HU: 'Az összes fertőzött'
			},
			totalRecoveredFromCoronavirus: {
				EN: 'Total recovered from coronavirus',
				FR: 'Total rétablis du coronavirus',
				TW: '治癒總數',
				KR: '총 완치자 수',
				DE: 'Gesamt vom Coronavirus geheilte',
				IT: 'Totale guariti dal coronavirus',
				ES: 'Total de recuperados por el coronavirus',
				HU: 'Az összes gyógyult'
			},
			totalDeadFromCoronavirus: {
				EN: 'Total deceased from coronavirus',
				FR: 'Total de décès du coronavirus',
				TW: '死亡總數',
				KR: '총 사망자 수',
				DE: 'Gesamt am Coronavirus verstorbene',
				IT: 'Morti totali da coronavirus',
				ES: 'Total de fallecidos por el coronavirus',
				HU: 'Az összes halott'
			},
			sortList: {
				EN: 'Sort list',
				FR: 'Trier la liste',
				TW: '排序列表',
				KR: '리스트 정렬',
				DE: 'Sortieren nach',
				IT: 'Ordina per',
				ES: 'Ordenar por',
				HU: 'Rendezés'
			},
			stayUpdated: {
				EN: 'Stay updated',
				FR: 'Rester à jour',
				TW: '密切留意更新',
				KR: '새로운 소식을 받으세요',
				DE: 'Bleibe informiert',
				IT: 'Rimani aggiornato',
				ES: 'Mantente actualizado',
				HU: 'Legyen naprakész'
			},
			bySigningUp: {
				EN:
					'By signing up for emails reports, installing the app or enabling push messages, you agree to our {pp}',
				FR:
					"En choisissant de recevoir des rapports par email, des notifications push ou en installant l'appli, vous acceptez notre {pp}",
				TW: '登入以收到電子郵件報告 推播訊息或安裝APP 同意{pp}',
				KR:
					'이메일 리포트를 신청, 앱을 다운로드, 또는 푸쉬 알림을 허용함으로써, 당신은 아래의 약관에 동의하게 됩니다. {pp}',
				DE:
					'Mit der Anmeldung für die E-Mail Berichte, zu den Push-Benachrichtigungen oder dem installieren unserer App, stimmst du unserer {pp} zu.',
				IT:
					"Iscrivendoti ai rapporti sulle e-mail, installando l'app o abilitando i messaggi push, accetti la nostra {pp}",
				ES:
					'Registrándote para informes por correo electrónico, instalando la app o activando las notificaciones, aceptas nuestra {pp}',
				HU:
					'Ha feliratkozik e-mailes jelentésekre, telepíti az alkalmazást vagy engedélyezi a push üzeneteket, akkor elfogadja a mi {pp}.'
			},
			privacyPolicy: {
				EN: 'Privacy policy',
				FR: 'Politique de vie privée',
				TW: '隱私權政策',
				KR: '개인 정보 보호 정책',
				DE: 'Datenschutzbestimmung',
				IT: 'politica della privacy',
				ES: 'política de privacidad',
				HU: 'adatvédelmi irányelveinket'
			},
			installTheApp: {
				EN: 'Install the app',
				FR: "Installez l'appli",
				TW: '安裝APP',
				KR: '앱 다운로드',
				DE: 'App installieren',
				IT: 'Installa l’app',
				ES: 'Instalar la aplicación',
				HU: 'Alkalmazás telepítése'
			},
			enablePushNotifications: {
				EN: 'Enable push notifications',
				FR: 'Autorizez les notifications push',
				TW: '開啟推播訊息',
				KR: '푸쉬 알림 허용',
				DE: 'Aktiviere Push-Benachrichtigungen',
				IT: 'Attiva le notifiche push',
				ES: 'Activar las notificaciones push',
				HU: 'Push-értesítések engedélyezése'
			},
			receiveEmailReports: {
				EN: 'Receive email reports',
				FR: 'Recevez des rapports par email',
				TW: '收取最新消息',
				KR: '이메일 리포트 신청',
				DE: 'Erhalte E-Mail Berichte',
				IT: 'Ricevi email di report',
				ES: 'Recibir reportes por email',
				HU: 'E-mailek fogadása'
			},
			firstName: {
				EN: 'First name',
				FR: 'Prénom',
				TW: '名',
				KR: '이름',
				DE: 'Vorname',
				IT: 'Nome',
				ES: 'Nombre',
				HU: 'Keresztnév'
			},
			lastName: {
				EN: 'Last name',
				FR: 'Nom',
				TW: '姓',
				KR: '성',
				DE: 'Nachname',
				IT: 'Cognome',
				ES: 'Apellido',
				HU: 'Vezetéknév'
			},
			email: {
				EN: 'Email',
				FR: 'Email',
				TW: '電子郵件',
				KR: '이메일',
				DE: 'E-Mail',
				IT: 'Email',
				ES: 'Email',
				HU: 'Email'
			},
			receiveRegularReports: {
				EN: 'Receive reports as the coronavirus situation evolves',
				FR: 'Recevez des rapports au fur et à mesure que la situation évoluera',
				TW: '獲得冠狀病毒最新消息',
				KR: '신종 코로나 바이러스의 진행 상황을 정규 리포트로 받아 보세요.',
				DE:
					'Erhalten Sie Berichte, wenn sich die Coronavirus-Situation entwickelt',
				IT:
					'Ricevi i report man mano che la situazione del coronavirus si evolve',
				ES:
					'Recibir reportes durante el desarrollo de la situación del coronavirus',
				HU: 'Értesítések fogadása a koronavírus helyzetének fejlődéséről'
			},
			noBrowserSupport: {
				EN:
					'Your browser may not support this feature, or you may have denied access.',
				FR:
					'Votre navigateur ne prend pas en charge cette fonctionnalité, ou bien vous avez refusez la permission.',
				TW: '您的瀏覽器可能不支援此功能',
				KR: '해당 브라우저가 지원하지 않는 기능이거나, 권한이 거부되었습니다.',
				DE:
					'Ihr Browser unterstützt diese Funktion möglicherweise nicht oder Sie haben möglicherweise den Zugriff auf diese Funktion verweigert',
				IT:
					"Il tuo browser potrebbe non supportare questa funzione oppure potresti aver negato l'accesso a questa funzione",
				ES:
					'Es posible que su navegador no soporte está característica, o usted ha bloqueado el acceso a esta característica',
				HU:
					'Lehet, hogy böngészője nem támogatja ezt a funkciót, vagy esetleg megtagadta a hozzáférést ehhez a szolgáltatáshoz'
			},
			fieldInvalid: {
				EN: 'Some fields are invalid',
				FR: 'Certains champs sont invalides',
				TW: '缺少或錯誤訊息',
				KR: '일부 지역은 이용이 불가합니다',
				DE: 'Einige Felder sind ungültig',
				IT: 'Alcuni campi sono invalidi',
				ES: 'Algunos campos son inválidos',
				HU: 'Néhány mező érvénytelen'
			},
			profileUpdated: {
				EN: 'Signed up successfully',
				FR: 'Inscription réussie',
				TW: '個人資料',
				KR: '프로필 업데이트',
				DE: 'Erfolgreich angemeldet',
				IT: 'Registrato correttamente',
				ES: 'Registrado satisfactoriamente',
				HU: 'Sikeresen regisztrált'
			},
			linkCopied: {
				EN: 'Link copied',
				FR: 'Lien copié',
				TW: '複製連結',
				KR: '링크 복사'
			},
			newCasesHistory: {
				EN: 'New cases',
				FR: 'Nouveaux cas',
				KR: '새 케이스',
				DE: 'Neue Fälle',
				IT: 'Nuovi casi',
				ES: 'Nuevos casos',
				HU: 'Új esetek'
			},
			confirmedCasesByCountry: {
				EN: 'Confirmed cases by country',
				FR: 'Cas confirmés par pays',
				TW: '地區性病毒確診總數',
				KR: '국가별 확진자 현황'
			},
			totalCurrentlySickByCoronavirus: {
				EN: 'Total currently sick from coronavirus',
				FR: 'Total malades actuellement du coronavirus',
				TW: '感染病毒總數',
				KR: '코로나 19의 현재 총 확진자 수',
				DE: 'Gesamt zur Zeit am Coronavirus erkrankte',
				IT: 'Malati attuali del coronavirus',
				ES: 'Total de enfermos actualmente con coronavirus',
				HU: 'Az összes beteg jelenleg'
			}
		}),
	c = new (function() {
		let e = this
		;(this.embedded = !!r.getParam('embed')),
			(this.countries = new G()),
			(this.all = []),
			(this.places = []),
			(this.reports = []),
			(this.persons = []),
			(this.config = {
				infected: {
					name: function() {
						return E('infected')
					},
					color: 'rgba(255, 65, 108, 1)',
					bg: 'rgba(255, 65, 108, 0.2)',
					middle: 'rgba(255, 65, 108, 0.75)'
				},
				dead: {
					name: function() {
						return E('dead')
					},
					color: 'rgba(134, 67, 230, 1)',
					bg: 'rgba(134, 67, 230, 0.2)',
					middle: 'rgba(134, 67, 230, 0.65)'
				},
				recovered: {
					name: function() {
						return E('recovered')
					},
					color: 'rgba(97, 206, 129, 1)',
					bg: 'rgba(97, 206, 129, 0.2)',
					middle: 'rgba(97, 206, 129, 0.65)'
				},
				sick: {
					name: function() {
						return E('sick')
					},
					color: 'rgba(40, 110, 255, 1)',
					bg: 'rgba(40, 110, 255, 0.2)',
					middle: 'rgba(40, 110, 255, 0.65)'
				}
			}),
			(this.masks = {
				adult: {
					name: function() {
						return E('adultMasks')
					},
					bg: 'rgba(59, 172, 226, 0.3)',
					color: 'rgba(59, 172, 226, 1)'
				},
				child: {
					name: function() {
						return E('childMasks')
					},
					bg: 'rgba(206, 121, 21, 0.43)',
					color: 'rgba(206, 121, 21, 1)'
				}
			}),
			(this.init = async function() {
				;(e.loading = new S()),
					e.loading.render(),
					await e.get(),
					e.loading.remove(),
					m && m.rerender()
			}),
			(this.get = async function() {
				await Promise.all([e.getLatest(), e.getCheckpoints()])
			}),
			(this.getLatest = async function() {
				e.places = await i.getPlaces()
			}),
			(this.getCheckpoints = async function(t) {
				e.checkpoints = await i.getCheckpoints()
			}),
			(this.getMostRecentCheckpoint = function() {
				let t = e.checkpoints || [],
					n = null
				return (
					t.forEach(function(e) {
						if (e.hide) return
						n || (n = e)
						let t = moment(e.id).isAfter(moment(n.id))
						t && (n = e)
					}),
					n || {}
				)
			}),
			(this.calculate = function(t, n) {
				let a = 0
				n && w(n), new G()
				if (
					(n &&
						e.places.forEach(function(n) {
							let i = e.matchSearch(n)
							i && (a += parseInt(n[t] || 0))
						}),
					!n)
				) {
					let n = e.getMostRecentCheckpoint()
					a = parseInt(n[t])
				}
				return a || (a = 0), a
			}),
			(this.getPlaceById = function(t) {
				return e.places.find(e => e.id === t)
			}),
			(this.dead = function() {
				return e.getMostRecentCheckpoint().dead
			}),
			(this.infected = function() {
				return e.getMostRecentCheckpoint().infected
			}),
			(this.recovered = function() {
				return e.getMostRecentCheckpoint().recovered
			}),
			(this.sick = function() {
				return e.getMostRecentCheckpoint().sick
			}),
			(this.getAffected = function(t, n) {
				let a = [...e.places]
				return a.sort(v(t)), n && a.reverse(), a
			}),
			(this.lastUpdated = function(t) {
				let n = null
				return (
					t.forEach(function(t) {
						if (!n) return void (n = t.lastUpdated)
						let a = t.lastUpdated
						if (a) {
							let t = e.compare(a, n),
								i = moment(a).isAfter(moment())
							t && !i && (n = a)
						}
					}),
					n
				)
			}),
			(this.compare = function(e, t) {
				return (
					!(!moment(e).isValid() || !moment(t).isValid()) &&
					moment(e).isAfter(moment(t))
				)
			}),
			(this.countriesAffected = function(e, t) {
				let n = []
				return (
					t.forEach(function(e) {
						let t = n.find(t => t.id === e.country),
							a = parseInt(e.infected || 0),
							i = parseInt(e.sick || 0),
							o = parseInt(e.dead || 0),
							r = parseInt(e.recovered || 0)
						'number' == typeof a &&
							(t
								? ((t.infected += a),
								  (t.recovered += r),
								  (t.dead += o),
								  (t.sick += i))
								: n.push({
										id: e.country,
										infected: a,
										recovered: r,
										dead: o,
										sick: i
								  }))
					}),
					n.sort(v(e)),
					n.reverse(),
					n
				)
			}),
			(this.matchSearch = function(t) {
				let n = r.getParam('query')
				if (!n && t.isMaster) return !0
				if (!n && t.isSub) return !0
				if (n && t.isMaster) return !1
				if (!n && !t.isMaster && !t.isSub) return !0
				let a = w(n),
					i = w(t.name),
					o = w(e.countries.name(t.country)),
					s = e.countries.findByName(a)
				return (
					(!s || o === a) &&
					(!(!s || t.country !== t.id) ||
						(!(a && !o.includes(a) && !i.includes(a)) &&
							!(!a && t.isSub) && (!a || !t.isMaster)))
				)
			})
	})(),
	u = new (function() {
		let a = this
		;(this.pageSize = new (function() {
			let e = this
			;(this.calculate = function() {
				let e = 0.01 * window.innerHeight
				document.documentElement.style.setProperty('--vh', e + 'px')
			}),
				(this.timer = null),
				(this.init = function() {
					e.calculate(),
						window.addEventListener('resize', () => {
							clearTimeout(e.timer), (e.timer = setTimeout(e.calculate, 200))
						})
				}),
				this.init()
		})()),
			(this.content = null),
			(this.toggleDark = function() {
				let e = document.querySelector('body')
				e.classList.toggle('dark')
			}),
			(this.showTW = function() {
				return 'TW' === o.getCountry() || 'TW' === o.lang
			}),
			(this.showKR = function() {
				return 'KR' === o.getCountry() || 'KR' === o.lang
			}),
			(this.sections = [
				{
					id: 'map',
					render: function(a) {
						return (
							(u.content = new (function(a) {
								let i = this
								;(this.element = null),
									(this.embedded = c.embedded),
									(this.map = null),
									(this.selector = a),
									(this.countries = new G()),
									(this.cookies = new U()),
									(this.sorter = 'nb'),
									(this.hovering = null),
									(this.id = B(20)),
									(this.sidebar = null),
									(this.mode = null),
									(this.regionSearch = null),
									(this.showingMasters = !0),
									(this.zoom = 4),
									(this.modes = {
										infected: {
											name: c.config.infected.name,
											color: c.config.infected.color
										},
										dead: {
											name: c.config.dead.name,
											color: c.config.dead.color
										},
										recovered: {
											name: c.config.recovered.name,
											color: c.config.recovered.color
										},
										sick: {
											name: c.config.sick.name,
											color: c.config.recovered.color
										}
									}),
									(this.defaultZoom = function() {
										if (n) return n
										let e = o.getCountry(),
											t = 4
										if (e) {
											let n = i.countries.zoom(e)
											n && (t = n)
										}
										return t
									}),
									(this.defaultCoordinates = function() {
										let n = r.getParam('selected')
										if (n && c.places) {
											let e = c.places.find(e => e.id === n)
											if (e) return [e.latitude, e.longitude]
										}
										if (e && t) return [e, t]
										let a = o.getCountry(),
											s = i.countries.longitude(a) || 43.6793,
											d = i.countries.latitude(a) || 33.2232
										return window.innerWidth > 991 || (d -= 4), [d, s]
									}),
									(this.makeSiteLink = function() {
										if (!i.embedded) return
										let e = document.createElement('a')
										e.classList.add('site-link'),
											e.setAttribute('href', 'https://coronavirus.app'),
											e.setAttribute('target', '_blank'),
											(e.textContent = 'coronavirus.app'),
											document.querySelector(i.selector).appendChild(e)
									}),
									(this.makeSidebar = function() {
										window.innerWidth > 991 &&
											(i.makeNumbers(),
											(i.regionSearch = new k({
												node: document.querySelector('main'),
												onRegionHover: i.highlightBubble,
												onSearch: i.searchMap,
												autofocus: !1
											})))
									}),
									(this.makeNumbers = function() {
										if (i.embedded) return
										document
											.querySelectorAll('.map-sidebar-numbers')
											.forEach(function(e) {
												e.remove()
											}),
											console.log(i.mode)
										let e = r.getParam('query'),
											t = document.createElement('div')
										t.classList.add('map-sidebar-numbers'),
											document.querySelector('main').appendChild(t)
										let n = document.createElement('div')
										n.classList.add('map-sidebar-section'), t.appendChild(n)
										let a = document.createElement('div')
										a.classList.add('map-sidebar-card'),
											(a.textContent = P(c.calculate('infected', e))),
											('infected' !== i.mode &&
												'name' !== i.mode &&
												'date' !== i.mode) ||
												a.classList.add('active'),
											a.addEventListener('click', function() {
												i.changeView('infected')
											}),
											a.setAttribute('data-title', 'infected'),
											a.setAttribute('data-text', E('infected')),
											n.appendChild(a)
										let o = document.createElement('div')
										o.classList.add('map-sidebar-card'),
											(o.textContent = P(c.calculate('dead', e))),
											o.addEventListener('click', function() {
												i.changeView('dead')
											}),
											('dead' !== i.mode && 'fatalityRate' !== i.mode) ||
												o.classList.add('active'),
											o.setAttribute('data-title', 'dead'),
											o.setAttribute('data-text', E('dead')),
											n.appendChild(o)
										let s = document.createElement('div')
										s.classList.add('map-sidebar-section'), t.appendChild(s)
										let d = document.createElement('div')
										d.classList.add('map-sidebar-card'),
											(d.textContent = P(c.calculate('recovered', e))),
											d.addEventListener('click', function() {
												i.changeView('recovered')
											}),
											('recovered' !== i.mode && 'recoveryRate' !== i.mode) ||
												d.classList.add('active'),
											d.setAttribute('data-title', 'recovered'),
											d.setAttribute('data-text', E('recovered')),
											s.appendChild(d)
										let l = document.createElement('div')
										l.classList.add('map-sidebar-card'),
											(l.textContent = P(c.calculate('sick', e))),
											l.addEventListener('click', function() {
												i.changeView('sick')
											}),
											'sick' === i.mode && l.classList.add('active'),
											l.setAttribute('data-title', 'sick'),
											l.setAttribute('data-text', E('sick')),
											s.appendChild(l)
									}),
									(this.createSortPopup = function(e) {
										let t = document.createElement('div')
										t.classList.add('backdrop', 'transparent'),
											t.addEventListener('click', function(e) {
												e.target === e.currentTarget && t.remove()
											}),
											document.querySelector('body').appendChild(t)
										let n = document.createElement('div')
										n.classList.add('map-sort-popup'), t.appendChild(n)
										let a = document.createElement('div')
										a.classList.add('map-sort-popup-container'),
											n.appendChild(a)
										let o = [
											{ id: 'name', string: E('name') },
											{ id: 'nb', string: E('toll') },
											{ id: 'date', string: E('lastUpdate') }
										]
										o.forEach(function(e) {
											let n = e.id.toString(),
												o = document.createElement('div')
											o.classList.add('map-sort-popup-item'), a.appendChild(o)
											let r = B(22),
												s = document.createElement('input')
											s.setAttribute('type', 'radio', 'Radio-Item'),
												(s.value = n),
												s.addEventListener('change', function() {
													t.remove(), i.changeSorting(n)
												}),
												i.sorter === e.id && (s.checked = !0),
												s.setAttribute('id', r),
												o.appendChild(s)
											let d = document.createElement('label')
											d.setAttribute('for', r),
												(d.textContent = e.string),
												o.appendChild(d)
										}),
											new N(n, e.target, 0, 0)
									}),
									(this.changeSorting = function(e) {
										;(i.sorter = e), i.render()
									}),
									(this.searchMap = function() {
										i.resetStyles(), i.makeNumbers(), i.fitMap()
									}),
									(this.highlightBubble = function(e) {
										i.map.eachLayer(function(t) {
											if (t.options.place)
												if (t.options.place.id === e) {
													let e = 'rgb(41, 84, 255)'
													t.setStyle({ color: e, fillColor: e }),
														t.openTooltip()
												} else t.setStyle(i.getPlaceStyle(t.options.place))
										})
									}),
									(this.fitMap = function() {
										if (!r.getParam('query')) return
										let e = [],
											t = []
										if (
											(i.map.eachLayer(function(n) {
												n.options.place &&
													n.options.show &&
													(e.push(n.options.place.longitude),
													t.push(n.options.place.latitude))
											}),
											e.sort(),
											t.sort(),
											e.length > 1 && t.length > 1)
										) {
											let n = [t[0] - 5, e[0] - 5],
												a = [t[t.length - 1] + 5, e[e.length - 1] + 20]
											i.map.flyToBounds([n, a])
										} else
											1 === e.length &&
												1 === t.length &&
												i.map.panTo([t[0], e[0]])
									}),
									(this.resetStyles = function() {
										i.map.eachLayer(function(e) {
											e.options.place &&
												e.setStyle(i.getPlaceStyle(e.options.place))
										})
									}),
									(this.updateDrawer = function(e) {
										i.embedded ||
											(r.setParam({ selected: e }),
											m.main.drawer &&
												(m.main.drawer.render(), m.main.drawer.semi()))
									}),
									(this.adjustZoom = function(e, t, n) {
										i.map && i.map.panTo([n, t])
									}),
									(this.hideDrawer = function() {
										i.embedded ||
											(m.main.drawer &&
												(m.main.drawer.close(), m.main.drawer.reset()))
									}),
									(this.showTooltip = function(e, t) {
										if (t.isMaster && (i.zoom > t.zoom || r.getParam('query')))
											return ''
										let n = document.querySelectorAll('.map-tooltip')
										n.forEach(function(e) {
											e.remove()
										}),
											(i.tooltip = document.createElement('div')),
											i.tooltip.classList.add(
												'map-tooltip',
												'Tooltip',
												'main-map'
											),
											(i.tooltip.innerHTML = ''),
											document.querySelector('.map').appendChild(i.tooltip)
										let a = document.createElement('div')
										a.classList.add('map-tooltip-title'),
											i.tooltip.appendChild(a)
										let o = document.createElement('img')
										o.setAttribute('src', i.countries.flag(t.country)),
											a.appendChild(o)
										let s = document.createElement('div')
										;(s.textContent = t.name), a.appendChild(s)
										let d = t.infected,
											l = t.dead,
											c = t.recovered,
											u = t.sick,
											m = document.createElement('div')
										m.classList.add('map-tooltip-line', 'infected'),
											(m.innerHTML =
												'<span>' +
												P(d) +
												'</span><span>' +
												E('infected') +
												'</span>'),
											d && i.tooltip.appendChild(m)
										let p = document.createElement('div')
										p.classList.add('map-tooltip-line', 'recovered'),
											(p.innerHTML =
												'<span>' +
												P(c) +
												'</span><span>' +
												E('recovered') +
												'</span>'),
											c && i.tooltip.appendChild(p)
										let h = document.createElement('div')
										h.classList.add('map-tooltip-line', 'dead'),
											(h.innerHTML =
												'<span>' +
												P(l) +
												'</span><span>' +
												E('dead') +
												'</span>'),
											l && i.tooltip.appendChild(h)
										let f = document.createElement('div')
										return (
											f.classList.add('map-tooltip-line', 'sick'),
											(f.innerHTML =
												'<span>' +
												P(u) +
												'</span><span>' +
												E('sick') +
												'</span>'),
											u && i.tooltip.appendChild(f),
											i.tooltip
										)
									}),
									(this.createModal = function(e) {
										if (i.embedded) {
											let t = window.location.origin + '/' + e
											window.open(t, '_blank')
										} else new T(e)
									}),
									(this.changeView = function(e) {
										i.modes[e] &&
											((i.mode = e),
											r.setParam({ mode: e }),
											i.regionSearch && i.regionSearch.renderRegions(),
											i.render())
									}),
									(this.createMap = function() {
										var a = L.GridLayer.prototype._initTile
										L.GridLayer.include({
											_initTile: function(e) {
												a.call(this, e)
												var t = this.getTileSize()
												;(e.style.width = t.x + 1 + 'px'),
													(e.style.height = t.y + 1 + 'px')
											}
										}),
											(i.map = L.map(i.id, {
												worldCopyJump: !0,
												zoomSnap: 1,
												maxBoundsViscosity: 0,
												zoomControl: !1,
												attributionControl: !1
											}).setView(i.defaultCoordinates(), i.defaultZoom()))
										let o = L.latLng(-89.98155760646617, -360),
											r = L.latLng(89.99346179538875, 360),
											s = L.latLngBounds(o, r)
										i.map.setMaxBounds(s),
											i.map.on('zoomend', function(e, t) {
												let a = i.map.getZoom()
												;(i.zoom = a), (n = a), i.resetStyles()
											}),
											i.map.on('movestart', function(e, t) {
												i.hideDrawer()
											}),
											i.map.on('moveend', function(n, a) {
												let o = i.map.getCenter()
												;(t = o.lng), (e = o.lat)
											}),
											L.tileLayer(
												'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
												{
													maxZoom: 10,
													minZoom: 2,
													attribution:
														'&copy; <a target="_blank" href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
												}
											).addTo(i.map),
											L.control
												.attribution({ position: 'bottomleft' })
												.addTo(i.map),
											L.control.zoom({ position: 'bottomleft' }).addTo(i.map)
									}),
									(this.bubbleSize = function(e) {
										let t = parseFloat(e || 0)
										if (0 === t) return 0
										Math.pow(t, 1.4)
										return (
											(z =
												1 === t
													? 6
													: 2 === t
													? 7
													: 3 === t
													? 8
													: t >= 3 && t <= 5
													? 9
													: t >= 5 && t <= 10
													? 10
													: t >= 10 && t <= 20
													? 11
													: t >= 20 && t <= 40
													? 12
													: t >= 40 && t <= 80
													? 13
													: t >= 80 && t <= 200
													? 14
													: t >= 200 && t <= 500
													? 15
													: t >= 500 && t <= 1e3
													? 16
													: t >= 1e3 && t <= 2e3
													? 17
													: t >= 2e3 && t <= 4e3
													? 21
													: t >= 4e3 && t <= 1e4
													? 26
													: t >= 1e4 && t <= 2e4
													? 30
													: t >= 2e4 && t <= 4e4
													? 40
													: t >= 4e4 && t <= 8e4
													? 50
													: t >= 8e4
													? 60
													: 7),
											parseInt(z)
										)
									}),
									(this.placeIsRenderable = function(e) {
										let t = r.getParam('query')
										return (
											!(!t || e.isMaster) ||
											((!t || !e.isMaster) &&
												!(i.zoom > e.zoom && e.isMaster) &&
													!(i.zoom <= e.zoom && e.isSub))
										)
									}),
									(this.getPlaceStyle = function(e) {
										let t = i.placeIsRenderable(e),
											n = c.matchSearch(e),
											a = n && t,
											o = a ? i.bubbleSize(e[i.mode]) : 0
										return {
											place: e,
											color: c.config[i.mode].color,
											show: !!a,
											radius: a ? o : 0,
											fillColor: c.config[i.mode].color,
											fillOpacity: a ? 0.2 : 0,
											weight: a ? 2 : 0,
											stroke: !!o,
											riseOnHover: !0
										}
									}),
									(this.addBubbles = function() {
										let e = c.places
										e.forEach(function(e) {
											L.circleMarker(
												[e.latitude, e.longitude],
												i.getPlaceStyle(e)
											)
												.bindTooltip(function(t) {
													return t && t.options && !t.options.fillOpacity
														? ''
														: i.showTooltip(t, e)
												})
												.on('tooltipopen', function(t, n) {
													i.highlightBubble(e.id)
												})
												.on('tooltipclose', function(e, t) {
													i.resetStyles()
												})
												.on('click', function(t, n) {
													if (
														t &&
														t.target &&
														t.target &&
														t.target.options &&
														!t.target.options.fillOpacity
													)
														return
													if (i.embedded) {
														let t = e.isMaster
															? '?selected=' + e.id
															: '/' + e.id + '?selected=' + e.id
														return void window.open(
															window.location.origin + t,
															'_blank'
														)
													}
													let a = window.innerWidth > 991
													;(e.isMaster && i.zoom > e.zoom) ||
														(e.isSub &&
															i.zoom <= e.zoom &&
															!r.getParam('query')) ||
														(a && e.isMaster
															? i.zoomOnCountry(e)
															: a && !e.isMaster
															? i.createModal(e.id)
															: !a && e.isMaster
															? (i.map.panTo([e.latitude, e.longitude]),
															  i.map.setZoom(e.zoom + 1),
															  i.adjustZoom(e.zoom, e.longitude, e.latitude),
															  i.updateDrawer(e.id))
															: a || e.isMaster || i.updateDrawer(e.id))
												})
												.addTo(i.map)
										})
									}),
									(this.zoomOnCountry = function(e) {
										i.regionSearch &&
											i.regionSearch.searchMap &&
											i.regionSearch.searchMap(e.name)
									}),
									(this.render = function() {
										;(document.querySelector(i.selector).innerHTML = ''),
											i.make(),
											i.createMap(),
											i.addBubbles(),
											i.makeSiteLink(),
											i.makeSidebar(),
											setTimeout(function() {
												i.recenterAroundSelected()
											}, 500)
									}),
									(this.recenterAroundSelected = function() {
										if (window.innerWidth > 991) {
											let e = r.getParam('query')
											if (!e) return
											i.regionSearch &&
												i.regionSearch.searchMap &&
												i.regionSearch.searchMap(e)
										} else {
											let e = r.getParam('selected'),
												t = c.places.find(t => t.id === e)
											t &&
												(i.adjustZoom(t.zoom || 5, t.longitude, t.latitude),
												setTimeout(function() {
													i.highlightBubble(e)
												}, 100)),
												i.updateDrawer(e)
										}
									}),
									(this.openPage = function() {
										let e = u.sections.find(e => e.id === u.current)
										!e && u.current && new T(u.current)
									}),
									(this.setMode = function() {
										let e = r.getParam('mode') || ''
										'fatalityRate' === e
											? (i.mode = 'dead')
											: 'recoveryRate' === e
											? (i.mode = 'recovered')
											: i.modes[e]
											? (i.mode = e)
											: (i.mode = 'infected')
									}),
									(this.make = function() {
										;(i.element = document.createElement('section')),
											i.element.classList.add('map'),
											i.embedded && i.element.classList.add('embedded'),
											i.element.setAttribute('id', i.id),
											document.querySelector(i.selector).appendChild(i.element)
									}),
									(this.init = function() {
										i.setMode(), i.openPage(), i.render()
									}),
									this.init()
							})(a)),
							u.content
						)
					}
				},
				{
					id: 'taiwan',
					render: function(e) {
						return (
							(u.content = new (function(e) {
								let t = this
								;(this.element = null),
									(this.embedded = c.embedded),
									(this.map = null),
									(this.selector = e),
									(this.sorter = 'nb'),
									(this.hovering = null),
									(this.id = B(22)),
									(this.lastUpdate = null),
									(this.mode = null),
									(this.modes = {
										adult: {
											name: c.masks.adult.name,
											bg: c.masks.adult.bg,
											color: c.masks.adult.color
										},
										child: {
											name: c.masks.child.name,
											bg: c.masks.child.bg,
											color: c.masks.child.color
										}
									}),
									(this.setMode = function() {
										let e = r.getParam('mode') || ''
										t.modes[e] ? (t.mode = e) : (t.mode = 'adult')
									}),
									(this.make = async function() {
										;(t.element = document.createElement('section')),
											t.element.classList.add('map'),
											t.embedded && t.element.classList.add('embedded'),
											t.element.setAttribute('id', t.id),
											document.querySelector(t.selector).appendChild(t.element)
									}),
									(this.getData = async function() {
										let e = await O('GET', '/get-taiwan-masks')
										;(t.lastUpdate = moment(e.lastUpdate)
											.utc()
											.format('YYYY[/]MM[/]DD, HH[:]mm')),
											(t.places = e.places),
											t.geolocated &&
												t.places.push({
													isMe: !0,
													lat: t.latitude,
													lng: t.longitude
												})
									}),
									(this.getLocation = async function() {
										let e = (await new D().get()) || {}
										e && e.latitude && e.longitude
											? (t.geolocated = !0)
											: (t.geolocated = !1),
											(t.latitude = e.latitude || 25.041718),
											(t.longitude = e.longitude || 121.543715)
									}),
									(this.makeSiteLink = function() {
										if (!t.embedded) return
										let e = document.createElement('a')
										e.classList.add('site-link'),
											e.setAttribute('href', 'https://coronavirus.app'),
											e.setAttribute('target', '_blank'),
											(e.textContent = 'coronavirus.app'),
											document.querySelector(t.selector).appendChild(e)
									}),
									(this.getPlaceStyle = function(e) {
										t.mode
										let n = e.isMe,
											a = 10,
											i = t.modes[t.mode].color,
											o = i,
											r = 2,
											s = 0.6
										return (
											n &&
												((i = 'rgba(220, 28, 28, 0.2)'),
												(o = 'rgba(220, 28, 28, 1)'),
												(a = 10),
												(s = 1),
												(r = 30)),
											{
												place: e,
												color: i,
												radius: a,
												fillColor: o,
												fillOpacity: s,
												weight: r,
												stroke: !0,
												riseOnHover: !0
											}
										)
									}),
									(this.render = function() {
										t.createMap(), t.addBubbles(), t.makeSiteLink()
									}),
									(this.createMap = function() {
										let e = L.GridLayer.prototype._initTile
										L.GridLayer.include({
											_initTile: function(t) {
												e.call(this, t)
												var n = this.getTileSize()
												;(t.style.width = n.x + 1 + 'px'),
													(t.style.height = n.y + 1 + 'px')
											}
										}),
											(t.map = L.map(t.id, {
												worldCopyJump: !0,
												zoomSnap: 1,
												zoomControl: !1,
												attributionControl: !1
											}).setView([t.latitude, t.longitude], 15))
										let n = L.latLng(-89.98155760646617, -180),
											a = L.latLng(89.99346179538875, 180),
											i = L.latLngBounds(n, a)
										t.map.setMaxBounds(i),
											L.tileLayer(
												'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
												{
													maxZoom: 20,
													minZoom: 11,
													attribution:
														'&copy; <a target="_blank" href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>'
												}
											).addTo(t.map),
											L.control
												.attribution({ position: 'bottomleft' })
												.addTo(t.map),
											L.control.zoom({ position: 'bottomleft' }).addTo(t.map)
									}),
									(this.goToMaps = function(e) {
										window.open('http://maps.google.com/?daddr=' + e, '_blank')
									}),
									(this.addBubbles = function() {
										let e = t.places
										e.forEach(function(e) {
											let n = L.circleMarker(
												[e.lat, e.lgn || e.lng],
												t.getPlaceStyle(e)
											)
											e.isMe ||
												n.bindTooltip(function(n) {
													return t.showTooltip(e)
												}),
												n.on('click', function() {
													t.goToMaps(e.a)
												}),
												n.addTo(t.map)
										})
									}),
									(this.changeView = function(e) {
										t.modes[e] &&
											((t.mode = e), r.setParam({ mode: e }), t.render())
									}),
									(this.showTooltip = function(e) {
										;(t.tooltip = document.createElement('div')),
											t.tooltip.classList.add('map-tooltip', 'Tooltip', 'long'),
											(t.tooltip.innerHTML = '')
										let n = document.createElement('div')
										n.classList.add('map-tooltip-name'),
											(n.textContent = e.n),
											t.tooltip.appendChild(n)
										let a = document.createElement('div')
										a.classList.add('map-tooltip-desc', 'grey'),
											(a.textContent = e.a),
											t.tooltip.appendChild(a)
										let i = document.createElement('div')
										i.classList.add('map-tooltip-desc'),
											(i.textContent = t.modes.adult.name() + ': ' + e.am),
											t.tooltip.appendChild(i)
										let o = document.createElement('div')
										o.classList.add('map-tooltip-desc'),
											(o.textContent = t.modes.child.name() + ': ' + e.cm),
											t.tooltip.appendChild(o)
										let r = document.createElement('div')
										r.classList.add('map-tooltip-desc'),
											(r.textContent = E('lastUpdate') + ': ' + t.lastUpdate),
											t.tooltip.appendChild(r)
										let s = document.createElement('i')
										return (
											s.classList.add(
												'feather',
												'feather-navigation',
												'map-tooltip-icon'
											),
											s.addEventListener('click', function() {
												t.goToMaps(address)
											}),
											t.tooltip.appendChild(s),
											t.tooltip
										)
									}),
									(this.init = async function() {
										;(t.loading = new S()),
											t.loading.render(),
											t.setMode(),
											await t.make(),
											await t.getLocation(),
											await t.getData(),
											t.element.parentNode && (t.render(), t.loading.remove())
									}),
									this.init()
							})(e)),
							u.content
						)
					}
				},
				{
					id: 'korea',
					render: function(e) {
						window.location.href = 'https://coronamap.site'
					}
				},
				{
					id: 'toll',
					render: function(e) {
						return r.setParam({ query: null }), new H(e, !0)
					}
				},
				{
					id: 'api',
					render: function(e) {
						return new (function(e) {
							let t = this
							;(this.element = null),
								(this.modal = null),
								(this.selector = e),
								(this.whyfree =
									'https://www.notion.so/coronavirus/Why-isn-t-the-Coronavirus-API-free-3791a3a37260471c9c54549fb9947893'),
								(this.documentation =
									'https://www.notion.so/coronavirus/Covid-19-Coronavirus-API-d1ce9d47e64c473bbc9a034661477e84'),
								(this.stripe = null),
								(this.stripeElements = null),
								(this.stripeCard = null),
								(this.stripeCardDomId = B(11)),
								(this.stripeSecret = null),
								(this.stripeApiKey = (function() {
									if (window.location.origin.includes('127.0.0.1:5000'))
										return !1
									return !0
								})()
									? 'pk_live_baP4x9rE9AGm40NSo85L2p0A'
									: 'pk_test_nZRBu6VLHdPXpChQYHf5aLAw'),
								(this.products = [
									{ id: '100k', name: '100K requests', price: 299 },
									{ id: '1m', name: '1M requests', price: 499 },
									{ id: '5m', name: '5M requests', price: 999 }
								]),
								(this.explanation =
									'The number of API requests included in your plan. 1 request = 1 GET to any of our endpoints with your API key. You can buy another API key or top up your existing key when you exceed the limit.'),
								(this.email = ''),
								(this.firstName = ''),
								(this.lastName = ''),
								(this.make = function() {
									;(t.element = document.createElement('section')),
										t.element.classList.add('api-shop'),
										document.querySelector(t.selector).appendChild(t.element)
								}),
								(this.currentChoice = t.products[0]),
								(this.changeCurrentChoice = function(e) {
									t.currentChoice = e
								}),
								(this.appendStripe = function() {
									let e = document.querySelector('#' + t.domId)
									if (e) return
									let n = document.createElement('script')
									n.setAttribute('src', 'https://js.stripe.com/v3/'),
										n.setAttribute('id', t.domId),
										document.querySelector('body').appendChild(n)
								}),
								(this.initStripeElements = function() {
									'undefined' != typeof Stripe && Stripe
										? ((t.stripe = Stripe(t.stripeApiKey)),
										  (t.stripeElements = t.stripe.elements()),
										  t.createBuyModal(),
										  t.createStripeElementsInstance())
										: setTimeout(function() {
												t.initStripeElements()
										  }, 100)
								}),
								(this.makePaymentIntent = async function() {
									let e = await O('POST', '/make-payment-intent', {
										productId: t.currentChoice.id
									})
									t.stripeSecret = e.data
								}),
								(this.openBuyModal = async function() {
									;(t.loading = new S()),
										t.loading.render(),
										t.appendStripe(),
										await t.makePaymentIntent(),
										t.initStripeElements(),
										t.loading.remove()
								}),
								(this.displayStripeError = function(e) {
									;(t.errors.innerHTML = ''), (t.errors.textContent = e || '')
								}),
								(this.getApiKey = async function() {
									try {
										let e = await O('POST', '/confirm-payment', {
											payment: t.paymentId,
											email: t.email
										})
										if (!e || !e.data) throw 'No api key'
										;(t.key = e.data), t.showKeyModal()
									} catch (e) {
										t.displayStripeError(
											"There was an unexpected issue generating your API key. Try again, but if it doesn't work, no worries, please contact us at hello@coronavirus.app and we'll fix the problem for you!"
										)
									}
								}),
								(this.showKeyModal = async function() {
									t.modal.remove(),
										(t.modal = null),
										(t.modal = document.createElement('div')),
										t.modal.classList.add('backdrop'),
										document.querySelector('body').appendChild(t.modal)
									let e = document.createElement('div')
									e.classList.add('api-shop-modal'), t.modal.appendChild(e)
									let n = document.createElement('div')
									n.classList.add('api-shop-modal-title'),
										(n.textContent = 'Your API key'),
										e.appendChild(n)
									let a = document.createElement('div')
									a.classList.add('api-shop-modal-desc'),
										(a.innerHTML =
											'We also sent your API key to <strong>' +
											t.email +
											'</strong>. <a href="mailto:hello@coronavirus.app" target="_blank">Tell us</a> what you\'re building  — we can probably help!'),
										e.appendChild(a)
									let i = document.createElement('code')
									i.classList.add('api-shop-modal-code'),
										(i.textContent = t.key),
										e.appendChild(i)
									let o = document.createElement('div')
									o.classList.add('api-shop-modal-footer'), e.appendChild(o)
									let r = document.createElement('button')
									r.classList.add('api-shop-modal-cancel', 'secondary'),
										r.addEventListener('click', t.destroyModal),
										(r.textContent = 'Done'),
										o.appendChild(r)
									let s = document.createElement('button')
									s.classList.add('api-shop-modal-validate', 'primary'),
										(s.textContent = 'View API Documentation'),
										s.addEventListener('click', function() {
											window.open(t.documentation, '_blank')
										}),
										o.appendChild(s)
								}),
								(this.confirmPayment = async function(e) {
									let n = e.target
									n.classList.add('loading')
									let a = t.verifyForm()
									if (a)
										return (
											t.displayStripeError(a),
											void n.classList.remove('loading')
										)
									if (!t.paymentId) {
										let e = await t.stripe.confirmCardPayment(t.stripeSecret, {
											payment_method: {
												card: t.stripeCard,
												billing_details: {
													name: t.firstName + ' ' + t.lastName,
													email: t.email
												}
											}
										})
										if (e.error)
											return (
												t.displayStripeError(e.error.message),
												void n.classList.remove('loading')
											)
										'succeeded' === e.paymentIntent.status &&
											(t.paymentId = e.paymentIntent.id)
									}
									await t.getApiKey(), n.classList.remove('loading')
								}),
								(this.createStripeElementsInstance = function() {
									;(t.stripeCard = t.stripeElements.create('card', {
										style: {
											base: {
												iconColor: '#c4f0ff',
												color: '#36363c',
												fontWeight: 500,
												fontSize: '12px',
												fontSmoothing: 'antialiased',
												':-webkit-autofill': { color: '#999' },
												'::placeholder': { color: '#999' },
												iconColor: '#999'
											},
											invalid: { iconColor: '#FF416C', color: '#FF416C' }
										}
									})),
										t.stripeCard.mount('#' + t.stripeCardDomId),
										t.stripeCard.addEventListener('change', function(e) {
											t.displayStripeError(e.message)
										})
								}),
								(this.verifyForm = function() {
									t.email
									let e = new F(t.email).valid()
									return t.email && e
										? t.firstName
											? t.lastName
												? void 0
												: 'You must enter a valid last name'
											: 'You must enter a valid first name'
										: 'You must enter a valid email'
								}),
								(this.updateForm = function(e, n) {
									t[e] = n
								}),
								(this.createBuyModal = function() {
									;(t.modal = document.createElement('div')),
										t.modal.classList.add('backdrop'),
										document.querySelector('body').appendChild(t.modal)
									let e = document.createElement('div')
									e.classList.add('api-shop-modal'), t.modal.appendChild(e)
									let n = document.createElement('div')
									n.classList.add('api-shop-modal-title'),
										(n.textContent =
											'Buy an API key (' + t.currentChoice.name + ')'),
										e.appendChild(n)
									let a = document.createElement('img')
									a.classList.add('api-shop-modal-powered'),
										a.setAttribute(
											'src',
											window.location.origin +
												'/assets/img/powered_by_stripe.png'
										),
										e.appendChild(a)
									let i = document.createElement('div')
									i.classList.add('api-shop-modal-form'), e.appendChild(i)
									let o = document.createElement('div')
									o.classList.add('api-shop-modal-row'), i.appendChild(o)
									let r = document.createElement('input')
									r.setAttribute('type', 'text'),
										r.classList.add('api-shop-modal-first-name'),
										r.setAttribute('placeholder', 'First name'),
										r.addEventListener('input', function(e) {
											t.updateForm('firstName', e.target.value)
										}),
										o.appendChild(r)
									let s = document.createElement('input')
									s.setAttribute('type', 'text'),
										s.classList.add('api-shop-modal-last-name'),
										s.setAttribute('placeholder', 'Last name'),
										s.addEventListener('input', function(e) {
											t.updateForm('lastName', e.target.value)
										}),
										o.appendChild(s)
									let d = document.createElement('div')
									d.classList.add('api-shop-modal-row'), i.appendChild(d)
									let l = document.createElement('input')
									l.setAttribute('type', 'text'),
										l.classList.add('api-shop-modal-email'),
										l.setAttribute('placeholder', 'Email'),
										l.addEventListener('input', function(e) {
											t.updateForm('email', e.target.value)
										}),
										d.appendChild(l)
									let c = document.createElement('div')
									c.classList.add('api-shop-container'),
										c.setAttribute('id', t.stripeCardDomId),
										i.appendChild(c),
										(t.errors = document.createElement('div')),
										t.errors.classList.add('api-shop-error'),
										e.appendChild(t.errors)
									let u = document.createElement('div')
									u.classList.add('api-shop-disclaimer'),
										(u.innerHTML =
											'By purchasing access to our API, you agree to our <a href="' +
											g.terms +
											'" target="_blank">Terms</a> and <a href="' +
											g.privacyPolicy +
											'" target="_blank">Privacy Policy</a>'),
										e.appendChild(u)
									let m = document.createElement('div')
									m.classList.add('api-shop-modal-footer'), e.appendChild(m)
									let p = document.createElement('button')
									p.classList.add('api-shop-modal-cancel', 'secondary'),
										p.addEventListener('click', t.destroyModal),
										(p.textContent = 'Cancel'),
										m.appendChild(p),
										(t.pay = document.createElement('button')),
										t.pay.classList.add('api-shop-modal-validate', 'primary'),
										t.pay.addEventListener('click', t.confirmPayment),
										(t.pay.textContent = 'Pay $' + t.currentChoice.price),
										m.appendChild(t.pay)
								}),
								(this.destroyModal = function() {
									;(t.paymentId = null),
										(t.stripeSecret = null),
										t.modal.remove()
								}),
								(this.render = function() {
									t.element.innerHTML = ''
									let e = document.createElement('div')
									e.classList.add('api-shop-inner'), t.element.appendChild(e)
									let n = document.createElement('div')
									n.classList.add('api-shop-title'),
										(n.textContent = 'The Coronavirus API'),
										e.appendChild(n)
									let a = document.createElement('div')
									a.classList.add('api-shop-content'), e.appendChild(a)
									let i = document.createElement('span')
									;(i.textContent =
										"This API enables you to retrieve the toll of the coronavirus in real-time. It's the very same API we're using on this website. Buy an API key now to get started."),
										a.appendChild(i)
									let o = document.createElement('a')
									o.classList.add('api-shop-link'),
										(o.textContent = "Why isn't this free?"),
										o.setAttribute('href', t.whyfree),
										o.setAttribute('target', '_blank'),
										a.appendChild(o)
									let r = document.createElement('div')
									r.classList.add('api-shop-products'),
										e.appendChild(r),
										t.products.forEach(function(e) {
											let n = document.createElement('div')
											n.classList.add('api-shop-product'), r.appendChild(n)
											let a = document.createElement('input')
											a.setAttribute('type', 'radio'),
												(a.value = e.id),
												e.id === t.currentChoice.id &&
													a.setAttribute('checked', !0),
												a.setAttribute('name', 'apiShopChoices'),
												a.setAttribute('id', e.id),
												a.addEventListener('change', function() {
													t.changeCurrentChoice(e)
												}),
												n.appendChild(a)
											let i = document.createElement('label')
											i.setAttribute('for', e.id),
												(i.textContent = e.name + '- $' + e.price),
												n.appendChild(i),
												new M(i, t.explanation)
										})
									let s = document.createElement('div')
									s.classList.add('api-shop-buttons'), e.appendChild(s)
									let d = document.createElement('button')
									d.classList.add('api-shop-button', 'primary'),
										(d.textContent = 'Get access now'),
										d.addEventListener('click', t.openBuyModal),
										s.appendChild(d)
									let l = document.createElement('button')
									l.classList.add('api-shop-button', 'secondary'),
										(l.textContent = 'View API Documentation'),
										l.addEventListener('click', function() {
											window.open(t.documentation, '_blank')
										}),
										s.appendChild(l)
								}),
								(this.init = function() {
									t.make(), t.render()
								}),
								this.init()
						})(e)
					}
				}
			]),
			(this.initialIsRegion = (r.get() || '').length > 15),
			(this.current = r.get() || 'map'),
			(this.change = function(e, t) {
				;(a.current = e),
					(a.content = null),
					r.replace([a.current]),
					t || m.rerender()
			}),
			(this.getCurrent = function() {
				let e = a.sections.find(e => e.id === a.current)
				return e || a.sections[0]
			})
	})()
new (function() {
	this.logo = window.location.origin + '/assets/img/logo/512.png?v=3'
})()
let m = null,
	p = null,
	h = null,
	f = window.location.pathname.split('/')
switch (f[1]) {
	case 'admin':
		c.init(),
			(p = new (function() {
				let e = this
				;(this.loggedin = !1),
					(this.console = null),
					(this.isLoggedIn = function(t) {
						return new Promise(function(n, a) {
							O('POST', '/verify-identity', { password: t })
								.then(function() {
									return (e.loggedin = !0), n()
								})
								.catch(function() {
									return (e.loggedin = !1), n()
								})
						})
					}),
					(this.prompt = async function() {
						let t = prompt('Please enter the password')
						await e.isLoggedIn(t), e.loggedin || alert('wrong password')
					}),
					(this.init = async function() {
						await e.isLoggedIn(),
							e.loggedin || (await e.prompt()),
							e.loggedin && e.start()
					}),
					(this.start = function() {
						e.console = new (function() {
							let e = this
							;(this.selector = 'main'),
								(this.places = []),
								(this.checkpoints = []),
								(this.reports = []),
								(this.editing = { dataType: null, id: null }),
								(this.temp = null),
								(this.placePage = 0),
								(this.reportPage = 0),
								(this.checkpointPage = 0),
								(this.reportNumberPerQuery = 500),
								(this.reportStartAt = null),
								(this.pageNumber = function(t) {
									switch (t) {
										case 'reports':
											return e.reportPage
										case 'places':
											return e.placePage
										case 'checkpoints':
											return e.checkpointPage
									}
								}),
								(this.itemsPerReportPage = 10),
								(this.itemsPerPlacePage = 10),
								(this.itemsPerCheckpointPage = 5),
								(this.itemsPerPage = function(t) {
									switch (t) {
										case 'reports':
											return e.itemsPerReportPage
										case 'places':
											return e.itemsPerPlacePage
										case 'checkpoints':
											return e.itemsPerCheckpointPage
									}
								}),
								(this.other = null),
								(this.perPageOptions = [
									5,
									10,
									20,
									30,
									40,
									50,
									60,
									70,
									80,
									90,
									100
								]),
								(this.countries = function() {
									let e = new G().list,
										t = []
									return (
										e.forEach(function(e) {
											t.push({ id: e.code, name: e.name })
										}),
										t
									)
								}),
								(this.sections = {
									checkpoints: {
										actions: { type: 'buttons', buttons: ['edit'] },
										id: { type: 'string', disabled: !0 },
										hide: { type: 'boolean' },
										infected: { type: 'number' },
										dead: { type: 'number' },
										recovered: { type: 'number' },
										createdAt: { type: 'date', disabled: !0 }
									},
									places: {
										actions: {
											type: 'buttons',
											buttons: ['edit', 'fetch', 'history']
										},
										id: { type: 'string', disabled: !0 },
										hide: { type: 'boolean' },
										country: {
											type: 'select',
											data: function() {
												return e.countries()
											}
										},
										name: { type: 'string' },
										longitude: { type: 'number' },
										latitude: { type: 'number' },
										latestReport: { type: 'date', disabled: !0 },
										createdAt: { type: 'date', disabled: !0 }
									},
									reports: {
										actions: { type: 'buttons', buttons: ['edit'] },
										id: { type: 'string', disabled: !0 },
										hide: { type: 'boolean' },
										placeId: {
											type: 'select',
											data: function() {
												return e.places
											}
										},
										infected: { type: 'number' },
										dead: { type: 'number' },
										recovered: { type: 'number' },
										date: { type: 'date' },
										createdAt: { type: 'date', disabled: !0 }
									}
								}),
								(this.getCheckpoints = async function() {
									let t = await O('GET', '/get-checkpoints')
									e.checkpoints = t.data || []
								}),
								(this.saveCheckpoint = async function(e) {
									await O('POST', '/update-checkpoint', e)
								}),
								(this.updateCheckpoint = async function() {
									if ('checkpoints' !== e.temp.dataType) return
									if (!e.temp.id) return
									let t = e.checkpoints.findIndex(t => t.id === e.temp.id),
										n = e.checkpoints[t],
										a =
											!0 === e.temp.hide || !1 === e.temp.hide
												? e.temp.hide
												: n.hide,
										i = {
											createdAt: e.temp.createdAt || n.createdAt,
											infected: e.temp.infected || n.infected,
											dead: e.temp.dead || n.dead,
											recovered: e.temp.recovered || n.recovered,
											id: e.temp.id,
											hide: a
										}
									;(e.checkpoints[t] = i),
										e.saveCheckpoint(i),
										e.rerender('checkpoints')
								}),
								(this.makeCheckpoint = function(t) {
									let n = []
									e.places.forEach(function(a) {
										let i = []
										e.reports.forEach(function(e) {
											e.hide || (e.placeId === a.id && i.push(e))
										}),
											i.sort(v('date')),
											i.reverse()
										for (let e = 0; e < i.length; e++) {
											let a = moment(i[e].date)
												.utc()
												.format('YYYYMMDD')
											if (a === t) {
												n.push(i[e])
												break
											}
										}
									})
									let a = { infected: 0, dead: 0, recovered: 0 }
									return (
										n.forEach(function(e) {
											Object.keys(a).forEach(function(t) {
												e[t] &&
													'number' == typeof e[t] &&
													e[t] > 0 &&
													(a[t] += e[t])
											}),
												(a.createdAt = e.date)
										}),
										a
									)
								}),
								(this.getMoreReports = function() {
									e.sort('reports', 'date'),
										(e.reportStartAt = e.reports[e.reports.length - 1].date),
										e.get('reports')
								}),
								(this.toggleEditing = function(t, n) {
									;(e.editing.dataType = t), (e.editing.id = n), e.render()
								}),
								(this.sort = function(t, n) {
									e[t].sort(v(n)), e[t].reverse(), e.rerender(t)
								}),
								(this.create = async function(t) {
									let n = { dataType: t },
										a = await O('POST', '/add-data', n)
									return (
										e[t].unshift(a),
										e.toggleEditing(t, a.id),
										e.rerender(t),
										a.id
									)
								}),
								(this.get = async function(t) {
									let n = { dataType: t }
									'reports' === t &&
										((n.startAt = e.reportStartAt),
										(n.limit = e.reportNumberPerQuery))
									let a = await O('POST', '/get-data', n)
									e.pushEntities(t, a.data), e.sort(t, 'createdAt')
								}),
								(this.pushEntities = async function(t, n) {
									n.forEach(function(n) {
										let a = e[t].findIndex(e => e.id === n.id)
										a > -1 ? (e[t][a] = n) : e[t].push(n)
									})
								}),
								(this.save = async function() {
									if (!e.temp || !e.temp.id) return void e.discard()
									'checkpoints' === e.temp.dataType
										? e.updateCheckpoint()
										: await O('POST', '/update-data', e.temp)
									let t = e[e.temp.dataType].findIndex(t => t.id === e.temp.id)
									if (t > -1)
										for (var n in e.temp) e[e.temp.dataType][t][n] = e.temp[n]
									e.discard()
								}),
								(this.update = async function(t, n, a) {
									for (var i in (e.temp || (e.temp = {}), t)) e.temp[i] = t[i]
									;(e.temp.id = a), (e.temp.dataType = n)
								}),
								(this.discard = function() {
									e.toggleEditing(null, null), (e.temp = null), e.render()
								}),
								(this.remove = async function(t, n) {
									let a = confirm('Are you sure you want to delete this?')
									if (!a) return void e.discard()
									await O('POST', '/delete-data', { dataType: n, id: t })
									let i = e[n].findIndex(e => e.id === t)
									i > -1 && e[n].splice(i, 1), e.discard()
								}),
								(this.renderTableHeader = function(t, n) {
									let a = document.createElement('tr')
									t.appendChild(a)
									for (let t in e.sections[n]) {
										let i = document.createElement('th')
										i.classList.add(e.sections[n][t].type),
											(i.textContent = t),
											i.addEventListener('click', function() {
												e.sort(n, t)
											}),
											a.appendChild(i)
									}
								}),
								(this.renderSection = function(t, n) {
									if (!n) return
									n.innerHTML = ''
									let a = document.createElement('div')
									if (
										((a.textContent = t),
										a.classList.add('console-section-title'),
										n.appendChild(a),
										'checkpoints' !== t && 'reports' !== t)
									) {
										let n = document.createElement('i')
										n.classList.add('feather', 'feather-plus-circle'),
											(e.editing.dataType || e.editing.id) &&
												n.classList.add('disabled'),
											n.addEventListener('click', function() {
												e.create(t)
											}),
											a.appendChild(n)
									}
									let i = document.createElement('table')
									n.appendChild(i),
										e.renderTableHeader(i, t),
										e.renderTableRows(i, t),
										e.renderPageList(n, t),
										e.renderItemPerPageSelector(n, t)
								}),
								(this.placeHistoryModal = function(t) {
									let n = e.places.find(e => e.id === t)
									new (function(e, t) {
										let n = this
										;(this.placeData = e),
											(this.data = []),
											(this.onClose = t),
											(this.id = n.placeData.id),
											(this.active = null),
											(this.element = null),
											(this.container = null),
											(this.columns = {
												id: { type: 'string', disabled: !0 },
												hide: { type: 'boolean' },
												infected: { type: 'number' },
												dead: { type: 'number' },
												recovered: { type: 'number' },
												date: { type: 'date' }
											}),
											(this.sort = function() {
												n.data.sort(v('date')), n.data.reverse()
											}),
											(this.getData = async function() {
												let e = await O('POST', '/get-all-reports-by-place', {
													id: n.id
												})
												;(n.data = e.data), n.sort()
											}),
											(this.remove = function() {
												n.element.remove(), n.onClose()
											}),
											(this.make = function() {
												;(n.element = document.createElement('div')),
													n.element.classList.add('backdrop'),
													document.querySelector('body').appendChild(n.element)
												let e = document.createElement('div')
												e.classList.add('admin-history-modal'),
													n.element.appendChild(e)
												let t = document.createElement('i')
												t.classList.add('admin-history-modal-x'),
													t.addEventListener('click', n.remove),
													t.classList.add('feather', 'feather-x'),
													e.appendChild(t)
												let a = document.createElement('h3')
												a.classList.add('admin-history-modal-title'),
													(a.textContent = n.placeData.name),
													e.appendChild(a)
												let i = document.createElement('button')
												i.classList.add('admin-history-modal-btn'),
													i.addEventListener('click', async function() {
														e.classList.add('unclickable'),
															await n.create(),
															e.classList.remove('unclickable')
													}),
													(i.textContent = 'New report'),
													e.appendChild(i),
													(n.container = document.createElement('div')),
													n.container.classList.add(
														'admin-history-modal-container'
													),
													e.appendChild(n.container)
											}),
											(this.setActiveReport = function(e) {
												;(n.active = e),
													document
														.querySelectorAll('.admin-history-report-row')
														.forEach(function(t) {
															let n = t.getAttribute('data-report-id')
															n === e
																? t.classList.add('active')
																: t.classList.remove('active')
														})
											}),
											(this.render = function() {
												n.container.innerHTML = ''
												let e = document.createElement('table')
												n.container.appendChild(e)
												let t = document.createElement('tr')
												e.appendChild(t)
												for (let e in n.columns) {
													let n = document.createElement('th')
													;(n.textContent = e), t.appendChild(n)
												}
												n.data.forEach(function(t) {
													let a = document.createElement('tr')
													a.classList.add('admin-history-report-row'),
														a.setAttribute('data-report-id', t.id),
														t.id === n.active && a.classList.add('active'),
														a.addEventListener('click', function() {
															n.setActiveReport(t.id, a)
														}),
														e.appendChild(a)
													for (let e in n.columns) {
														let i = n.columns[e].type,
															o = document.createElement('td')
														a.appendChild(o)
														let r = null
														switch (i) {
															case 'string':
																r = n.makeString(t.id, e, t[e])
																break
															case 'number':
																r = n.makeNumber(t.id, e, t[e])
																break
															case 'boolean':
																r = n.makeBoolean(t.id, e, t[e])
																break
															case 'date':
																r = n.makeDate(t.id, e, t[e])
														}
														r && o.appendChild(r)
													}
												})
											}),
											(this.update = async function(e, t, a) {
												let i = { dataType: 'reports', id: e, [t]: a },
													o = n.data.find(t => t.id === e)
												;(o[t] = a),
													console.log(i),
													n.sort(),
													n.render(),
													await O('POST', '/update-data', i)
											}),
											(this.makeString = function(e, t, a) {
												let i = document.createElement('input')
												i.setAttribute('type', 'text'), (i.value = a || '')
												let o = n.columns[t].disabled
												return o && i.classList.add('disabled'), i
											}),
											(this.verifyNumber = function(e, t, a) {
												a = parseInt(a || 0)
												let i = n.data.findIndex(t => t.id === e)
												if (i < 0) return !0
												let o = n.data[i - 1],
													r = n.data[i + 1]
												return (
													!(o && (o[t] || 0) < a) && !(r && (r[t] || 0) > a)
												)
											}),
											(this.makeNumber = function(e, t, a) {
												let i = document.createElement('input')
												i.setAttribute('type', 'number')
												let o = n.verifyNumber(e, t, a)
												return (
													o || i.classList.add('invalid'),
													(i.value = parseFloat(a) || 0),
													i.addEventListener('change', function(a) {
														let o = parseInt(a.target.value),
															r = n.verifyNumber(e, t, o)
														r
															? (i.classList.remove('invalid'),
															  n.update(e, t, o))
															: i.classList.add('invalid')
													}),
													i
												)
											}),
											(this.makeBoolean = function(e, t, a) {
												let i = document.createElement('div'),
													o = B(22),
													r = document.createElement('input')
												r.setAttribute('type', 'checkbox'),
													r.setAttribute('id', o),
													(r.checked = !!a),
													r.addEventListener('change', function(a) {
														n.update(e, t, a.target.checked)
													}),
													i.appendChild(r)
												let s = document.createElement('label')
												return s.setAttribute('for', o), i.appendChild(s), i
											}),
											(this.makeDate = function(e, t, a) {
												let i = document.createElement('div'),
													o = moment().utcOffset(),
													r = B(20),
													s = document.createElement('input')
												s.setAttribute('type', 'date'),
													s.addEventListener('keydown', function(e) {
														e.preventDefault(), e.stopPropagation()
													}),
													s.setAttribute(
														'max',
														moment()
															.utc()
															.format('YYYY[-]MM[-]DD')
													),
													s.setAttribute('min', '2020-01-20'),
													s.setAttribute('id', r),
													(s.value = a
														? moment(a)
																.utc()
																.format('YYYY[-]MM[-]DD')
														: '')
												let d = n.columns[t].disabled
												return (
													d
														? i.classList.add('disabled')
														: s.addEventListener('change', function(a) {
																let i = moment(a.target.value)
																		.add(o, 'minutes')
																		.toISOString(),
																	r = moment(),
																	s = moment(i).isAfter(r)
																s && (i = r.toISOString()),
																	(i = moment(i)
																		.add(10, 'minutes')
																		.toISOString()),
																	console.log(i),
																	n.update(e, t, i)
														  }),
													i.appendChild(s),
													i
												)
											}),
											(this.create = async function() {
												let e = await O('POST', '/add-data', {
													dataType: 'reports'
												})
												;(e.placeId = n.id),
													n.data.unshift(e),
													n.sort(),
													n.update(e.id, 'placeId', e.placeId),
													n.render(),
													n.setActiveReport(e.id)
											}),
											(this.init = async function() {
												n.make(), await n.getData(), n.render()
											}),
											this.init()
									})(n, e.render)
								}),
								(this.renderItemPerPageSelector = function(t, n) {
									let a = document.createElement('div')
									a.classList.add('per-page-picker'), t.appendChild(a)
									let i = document.createElement('span')
									;(i.textContent = 'Results per page'), a.appendChild(i)
									let o = document.createElement('select')
									o.addEventListener('change', function(t) {
										let a = parseInt(t.target.value)
										'reports' === n
											? (e.itemsPerReportPage = a)
											: 'places' === n
											? (e.itemsPerPlacePage = a)
											: 'checkpoints' === n && (e.itemsPerCheckpointPage = a),
											e.rerender(n)
									}),
										a.appendChild(o),
										e.perPageOptions.forEach(function(t) {
											let a = document.createElement('option')
											a.setAttribute('value', t),
												(a.textContent = t),
												(('reports' === n && t === e.itemsPerReportPage) ||
													('places' === n && t === e.itemsPerPlacePage) ||
													('checkpoints' === n &&
														t === e.itemsPerCheckpointPage)) &&
													a.setAttribute('selected', 'true'),
												o.appendChild(a)
										})
								}),
								(this.makeButtons = function(t, n, a, i, o) {
									let r = document.createElement('span')
									r.classList.add('console-button-cell')
									let s = n.buttons,
										d = e.editing.dataType === a && e.editing.id === o
									if (s.includes('delete')) {
										let t = document.createElement('i')
										t.classList.add('feather', 'feather-trash'),
											t.addEventListener('click', function() {
												e.remove(o, a)
											}),
											r.appendChild(t),
											new M(t, 'Delete')
									}
									if (s.includes('fetch')) {
										let t = document.createElement('i')
										t.classList.add('feather', 'feather-file-plus'),
											t.addEventListener('click', function() {
												e.openRegionModal(o)
											}),
											r.appendChild(t),
											new M(t, 'New report for this region')
									}
									if (s.includes('history')) {
										let t = document.createElement('i')
										t.classList.add('feather', 'feather-list'),
											t.addEventListener('click', function() {
												e.placeHistoryModal(o)
											}),
											r.appendChild(t),
											new M(t, 'New report for this region')
									}
									if (s.includes('edit') && d) {
										let t = document.createElement('i')
										t.classList.add('feather', 'feather-check'),
											t.addEventListener('click', function() {
												let t = confirm(
													"If you press OK, your changes will be saved. Else, they'll be cancelled."
												)
												t ? e.save() : e.discard()
											}),
											r.appendChild(t),
											new M(t, 'Confirm')
									}
									if (s.includes('edit') && !d) {
										let t = document.createElement('i')
										t.classList.add('feather', 'feather-edit-2'),
											t.addEventListener('click', function() {
												e.toggleEditing(a, o)
											})
										let n =
											e.editing.dataType &&
											e.editing.id &&
											(e.editing.dataType !== a || e.editing.id !== o)
										n && t.classList.add('disabled'),
											r.appendChild(t),
											new M(t, 'Manually edit')
									}
									return r
								}),
								(this.renderTableRow = function(t, n, a) {
									let i = document.createElement('tr')
									n.appendChild(i)
									let o = e.editing.dataType === t && e.editing.id === a.id
									if ((o && i.classList.add('editable'), 'places' === t)) {
										let e = moment().diff(moment(a.latestReport), 'minutes')
										e < 60 && (i.style.background = '#89ff89')
									}
									for (var r in ('checkpoints' === t &&
										moment()
											.utc()
											.format('YYYYMMDD') == a.id &&
										i.classList.add('disabled'),
									e.sections[t]))
										e.renderTableCell(t, r, i, a)
								}),
								(this.renderTableCell = function(t, n, a, i) {
									let o = document.createElement('td')
									o.classList.add(e.sections[t][n].type),
										e.sections[t][n].disabled &&
											o.classList.add('disabled', 'disabled'),
										a.appendChild(o)
									let r = null
									switch (e.sections[t][n].type) {
										case 'string':
											r = e.makeString(i[n], e.sections[t][n], t, n, i.id)
											break
										case 'select':
											r = e.makeSelect(i[n], e.sections[t][n], t, n, i.id)
											break
										case 'number':
											r = e.makeNumber(i[n], e.sections[t][n], t, n, i.id)
											break
										case 'boolean':
											r = e.makeBoolean(i[n], e.sections[t][n], t, n, i.id)
											break
										case 'date':
											r = e.makeDate(i[n], e.sections[t][n], t, n, i.id)
											break
										case 'buttons':
											r = e.makeButtons(i[n], e.sections[t][n], t, n, i.id)
									}
									o.appendChild(r)
								}),
								(this.renderTableRows = function(t, n) {
									let a = e.pageNumber(n) * e.itemsPerPage(n),
										i = a + e.itemsPerPage(n)
									for (let o = a; o < i; o++) {
										let a = e[n][o]
										if (!a) break
										e.renderTableRow(n, t, a)
									}
								}),
								(this.renderSections = function() {
									for (let t in e.sections) {
										let n = t + 'Node'
										;(e[n] = document.createElement('div')),
											e[n].classList.add('console-section'),
											e.element.appendChild(e[n]),
											e.renderSection(t, e[n])
									}
								}),
								(this.renderPageList = function(t, n) {
									let a = document.createElement('div')
									a.classList.add('console-page-list'), t.appendChild(a)
									let i = e[n].length / e.itemsPerPage(n)
									for (let t = 0; t < i; t++) {
										let i = t.toString(),
											o = document.createElement('div')
										o.classList.add('console-page-item'),
											'reports' === n && e.reportPage === t
												? o.classList.add('disabled')
												: 'places' === n && e.placePage === t
												? o.classList.add('disabled')
												: 'checkpoints' === n &&
												  e.checkpointPage === t &&
												  o.classList.add('disabled'),
											(o.textContent = i),
											o.addEventListener('click', function() {
												e.changePage(i, n)
											}),
											a.appendChild(o)
									}
									if ('reports' === n) {
										let t = document.createElement('div')
										;(t.textContent = 'Load more'),
											t.classList.add('console-page-item'),
											t.addEventListener('click', e.getMoreReports),
											(t.style.width = '100px'),
											a.appendChild(t)
									}
								}),
								(this.renderConsole = function() {
									let t = document.querySelector(e.selector)
									;(t.innerHTML = ''),
										(e.element = document.createElement('section')),
										e.element.classList.add('console'),
										t.appendChild(e.element)
								}),
								(this.render = function() {
									e.renderConsole(), e.renderSections()
								}),
								(this.rerender = function(t) {
									switch (t) {
										case 'reports':
											e.renderSection(t, e.reportsNode)
											break
										case 'places':
											e.addLatestReportIntoRegion(),
												e.renderSection(t, e.placesNode)
											break
										case 'checkpoints':
											e.renderSection(t, e.checkpointsNode)
									}
								}),
								(this.changePage = function(t, n) {
									if ('reports' === n) e.reportPage = parseInt(t)
									else if ('places' === n) e.placePage = parseInt(t)
									else {
										if ('checkpoints' !== n) return
										e.checkpointPage = parseInt(t)
									}
									e.rerender(n)
								}),
								(this.makeString = function(t, n, a, i, o) {
									let r = document.createElement('input')
									return (
										r.setAttribute('type', 'text'),
										(r.value = t || ''),
										r.addEventListener('keyup', function(t) {
											e.update({ [i]: t.target.value }, a, o)
										}),
										r
									)
								}),
								(this.makeSelect = function(t, n, a, i, o) {
									let r = document.createElement('select')
									if (!n.data())
										throw 'You must specify a data option for the select option'
									r.addEventListener('change', function(t) {
										e.update({ [i]: t.target.value }, a, o)
									})
									let s = !1
									n.data().forEach(function(e) {
										let n = document.createElement('option')
										n.setAttribute('value', e.id),
											n.setAttribute('label', e.name || e.id),
											e.id === t &&
												((s = !0), n.setAttribute('selected', 'selected')),
											r.appendChild(n)
									})
									let d = document.createElement('option')
									return (
										d.setAttribute('value', ''),
										d.setAttribute('label', ''),
										s || d.setAttribute('selected', 'selected'),
										r.appendChild(d),
										r
									)
								}),
								(this.makeNumber = function(t, n, a, i, o) {
									let r = document.createElement('input')
									r.setAttribute('type', 'number')
									let s = t || 0
									return (
										n.data && 'function' == typeof n.data && (s = n.data(o)),
										(r.value = s),
										r.addEventListener('change', function(t) {
											e.update({ [i]: parseFloat(t.target.value) }, a, o)
										}),
										r
									)
								}),
								(this.makeBoolean = function(t, n, a, i, o) {
									let r = document.createElement('div'),
										s = B(22),
										d = document.createElement('input')
									d.setAttribute('type', 'checkbox'),
										d.setAttribute('id', s),
										(d.checked = !!t),
										d.addEventListener('change', function(t) {
											e.update({ [i]: t.target.checked }, a, o)
										}),
										r.appendChild(d)
									let l = document.createElement('label')
									return l.setAttribute('for', s), r.appendChild(l), r
								}),
								(this.makeDate = function(t, n, a, i, o) {
									let r = document.createElement('div'),
										s = B(20),
										d = document.createElement('input')
									return (
										d.setAttribute('type', 'datetime-local'),
										d.setAttribute('id', s),
										(d.value = t ? t.slice(0, 16) : ''),
										d.addEventListener('change', function(t) {
											let n = moment(t.target.value).toISOString()
											e.update({ [i]: n }, a, o)
										}),
										r.appendChild(d),
										r
									)
								}),
								(this.init = async function() {
									await e.downloadAll(),
										e.addLatestReportIntoRegion(),
										e.render()
								}),
								(this.downloadAll = async function() {
									await Promise.all([
										e.get('reports'),
										e.get('places'),
										e.getCheckpoints()
									])
								}),
								(this.openRegionModal = function(t) {
									e.reports.sort(v('date')), e.reports.reverse()
									let n = e.places.find(e => e.id === t),
										a = e.reports.find(e => e.placeId === t) || {},
										i = {
											infected: parseInt(a.infected || 0),
											dead: parseInt(a.dead || 0),
											recovered: parseInt(a.recovered || 0)
										}
									;(e.newReportModal = document.createElement('div')),
										e.newReportModal.classList.add('backdrop'),
										document.querySelector('body').appendChild(e.newReportModal)
									let o = document.createElement('div')
									o.classList.add('modal'), e.newReportModal.appendChild(o)
									let r = document.createElement('div')
									r.classList.add('admin-console-modal-titles'),
										o.appendChild(r)
									let s = document.createElement('h4')
									;(s.textContent = 'Create new report'), r.appendChild(s)
									let d = document.createElement('p')
									;(d.textContent = n.name), r.appendChild(d)
									let l = document.createElement('div')
									l.classList.add('admin-console-modal-numbers'),
										o.appendChild(l)
									let c = function(e, t) {
										let n = '',
											o = '',
											r = e.target.parentNode
										a[t] > e.target.value
											? (o = t + ' cannot be less than in the previous report')
											: a.infected > i.infected ||
											  a.dead > i.dead ||
											  a.recovered > i.recovered
											? (o =
													'All fields must be higher than the previous report')
											: i.dead + i.recovered > i.infected
											? (o = 'Dead + Recovered cannot be superior to Infected')
											: i[t] < 0
											? (o = t + ' cannot be negative')
											: i[t] > 20 &&
											  i[t] > 2 * a[t] &&
											  (n =
													'This is a lot more than the latest report. Please double check this is correct'),
											o
												? (r.setAttribute('data-error', o),
												  r.removeAttribute('data-warning'),
												  p.classList.add('disabled'))
												: n
												? (r.setAttribute('data-warning', n),
												  r.removeAttribute('data-error'),
												  p.classList.remove('disabled'))
												: (r.removeAttribute('data-error'),
												  r.removeAttribute('data-warning'),
												  p.classList.remove('disabled'))
									}
									for (let e in i) {
										e.toString()
										let t = document.createElement('div')
										t.classList.add('admin-console-modal-sec'), l.appendChild(t)
										let n = document.createElement('div')
										n.classList.add('admin-console-modal-sec-title'),
											(n.textContent = e),
											t.appendChild(n)
										let a = document.createElement('input')
										a.setAttribute('type', 'number'),
											(a.value = i[e]),
											a.addEventListener('input', function(t) {
												;(i[e] = parseInt(t.target.value)), c(t, e)
											}),
											t.appendChild(a)
										let o = document.createElement('div')
										t.appendChild(o)
										let r = document.createElement('div')
										;(r.textContent = 'Latest:' + i[e]), o.appendChild(r)
									}
									let u = document.createElement('div')
									u.classList.add('admin-console-modal-row'), o.appendChild(u)
									let m = document.createElement('button')
									;(m.textContent = 'Cancel'),
										m.addEventListener('click', function() {
											e.newReportModal.remove()
										}),
										u.appendChild(m)
									let p = document.createElement('button')
									p.classList.add('disabled'),
										(p.textContent = 'Create this report'),
										p.addEventListener('click', function(n) {
											e.createUpdateReport(n, t, i, a)
										}),
										u.appendChild(p)
								}),
								(this.createUpdateReport = async function(t, n, a, i) {
									t.target.classList.add('disabled')
									let o =
											!(!i || !i.date) &&
											moment()
												.utc()
												.isSame(i.date, 'day'),
										r = ''
									r = o ? i.id : await e.create('reports')
									let s = moment().toISOString()
									;(e.temp = {
										id: r,
										infected: a.infected,
										dead: a.dead,
										recovered: a.recovered,
										hide: !1,
										placeId: n,
										date: s,
										dataType: 'reports'
									}),
										await e.save(),
										e.newReportModal.remove(),
										e.rerender('reports'),
										e.rerender('places')
								}),
								(this.addLatestReportIntoRegion = async function() {
									let t = [...e.reports]
									t.sort(v('date')),
										t.reverse(),
										e.places.forEach(function(e) {
											let n = t.find(t => t.placeId === e.id)
											n && n.date && (e.latestReport = n.date)
										})
								}),
								this.init()
						})()
					}),
					this.init()
			})())
		break
	case 'chart':
		h = new b('main', f[2], f[3], !0)
		break
	default:
		c.init(),
			(m = new (function() {
				let e = this
				;(this.element = null),
					(this.headerSelector = 'header'),
					(this.mainSelector = 'main'),
					(this.footerSelector = 'footer'),
					(this.sidebar = new (function(e) {
						let t = this
						;(this.selector = e),
							(this.element = null),
							(this.sections = u.sections),
							(this.container = document.querySelector(t.selector)),
							(this.hamburger = null),
							(this.inner = null),
							(this.settings = null),
							(this.sourcesPopup = function() {
								window.open(
									'https://www.notion.so/coronavirus/What-are-your-sources-4f3f962953f1418da96eae1b5fe06039',
									'_target'
								)
							}),
							(this.embedPopup = function() {
								u.change('map')
								let e = window.location.href.includes('?')
										? window.location.href + '&embed=true'
										: window.location.href + '?embed=true',
									t = document.querySelector('body'),
									n = document.createElement('div')
								n.classList.add('backdrop'),
									n.addEventListener('click', function(e) {
										e.target === e.currentTarget && n.remove()
									}),
									t.appendChild(n)
								let a = document.createElement('div')
								a.classList.add('Global-Embed-Popup'), n.appendChild(a)
								let i = document.createElement('div')
								;(i.textContent = E('embed')), a.appendChild(i)
								let o = document.createElement('code')
								;(o.textContent =
									'<iframe style="width:100%"; width="560" height="380" src="' +
									e +
									'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'),
									a.appendChild(o)
							}),
							(this.launchRegionsSearch = function() {
								r.setParam({ query: null }),
									new k({ node: document.querySelector('body'), autofocus: !1 })
							}),
							(this.openForm = function() {
								window.open(a, '_blank')
							}),
							(this.openMailTo = function() {
								window.open('mailto:hello@coronavirus.app', '_blank')
							}),
							(this.currentSection = function() {
								return u.current || 'map'
							}),
							(this.toggleMenu = function() {
								t.container.classList.toggle('open')
							}),
							(this.makeHamburger = function() {
								;(t.hamburger = document.createElement('i')),
									t.hamburger.classList.add(
										'feather',
										'feather-menu',
										'header-hamburger'
									),
									t.container.appendChild(t.hamburger),
									t.hamburger.addEventListener('click', t.toggleMenu)
							}),
							(this.make = function() {
								c.embedded ||
									(t.container.addEventListener('click', function(e) {
										e.target === e.currentTarget && t.toggleMenu()
									}),
									(t.container.innerHTML = ''),
									t.makeHamburger(),
									t.makeInner())
							}),
							(this.makeInner = function() {
								;(t.element = document.createElement('div')),
									t.element.classList.add('header-inner'),
									t.container.appendChild(t.element)
							}),
							(this.renderSettings = function() {
								;(t.settings = document.createElement('div')),
									t.settings.classList.add('header-settings'),
									t.element.appendChild(t.settings)
								let e = document.createElement('div')
								e.classList.add('header-settings-title'),
									(e.textContent = E('preferences')),
									t.settings.appendChild(e)
								let n = [
									{
										name: function() {
											return E('darkMode')
										},
										content: function(e) {
											new (function(e) {
												let t = this
												;(this.container = e),
													(this.body = document.querySelector('body')),
													(this.className = 'dark'),
													(this.cookieName = 'darkmode'),
													(this.element = null),
													(this.cookies = new U()),
													(this.id = B(11)),
													(this.on = !1),
													(this.toggle = function(e) {
														e
															? ((t.on = !0),
															  t.body.classList.add(t.className),
															  t.setCookie('on'))
															: ((t.on = !1),
															  t.body.classList.remove(t.className),
															  t.setCookie('off'))
													}),
													(this.getCookie = function() {
														let e = t.cookies.get(t.cookieName)
														'on' === e && t.toggle(!0)
													}),
													(this.setCookie = function(e) {
														t.cookies.set(t.cookieName, e, 9999)
													}),
													(this.make = function() {
														;(t.element = document.createElement('div')),
															t.element.classList.add('dark-mode-toggle'),
															t.container.appendChild(t.element)
													}),
													(this.render = function() {
														t.element.innerHTML = ''
														let e = document.createElement('input')
														e.setAttribute('type', 'checkbox'),
															t.on && e.setAttribute('checked', 'checked'),
															e.setAttribute('id', t.id),
															e.addEventListener('change', function(e) {
																t.toggle(e.target.checked)
															}),
															t.element.appendChild(e)
														let n = document.createElement('label')
														n.setAttribute('for', t.id),
															t.element.appendChild(n)
													}),
													(this.init = function() {
														t.getCookie(), t.make(), t.render()
													}),
													this.init()
											})(e)
										}
									},
									{
										name: function() {
											return E('language')
										},
										content: function(e) {
											t.renderLanguage(e)
										}
									}
								]
								n.forEach(function(e) {
									let n = document.createElement('div')
									n.classList.add('header-settings-el'),
										t.settings.appendChild(n)
									let a = document.createElement('div')
									a.classList.add('header-settings-el-title'),
										(a.textContent = e.name()),
										n.appendChild(a)
									let i = document.createElement('div')
									i.classList.add('header-settings-el-content'),
										n.appendChild(i),
										e.content(i)
								})
							}),
							(this.renderLanguage = function(e) {
								let t = document.createElement('div')
								t.classList.add('language-selector'),
									o.selector(t),
									e.appendChild(t)
							}),
							(this.renderMenu = function() {
								if (c.embedded) return
								let e = document.createElement('div')
								e.classList.add('header-logo'),
									(e.textContent = 'The Coronavirus App'),
									e.addEventListener('click', function() {
										window.location.href = window.location.origin
									}),
									t.element.appendChild(e),
									(t.inner = document.createElement('div')),
									t.inner.classList.add('header-sections'),
									t.element.appendChild(t.inner)
								let n = t.currentSection(),
									a = ['map', 'toll', 'taiwan', 'korea', 'api']
								t.menu.forEach(function(e, i) {
									if (e.onlyIf && 'function' == typeof e.onlyIf && !e.onlyIf())
										return
									let o = document.createElement('div')
									o.classList.add('header-section'),
										((e.id && e.id === n) ||
											(!a.includes(n) && 'map' === e.id)) &&
											o.classList.add('active'),
										t.inner.appendChild(o),
										o.addEventListener('click', function() {
											t.toggleMenu(), e.fn(e.id)
										})
									let r = document.createElement('i')
									e.icon.forEach(function(e) {
										r.classList.add(e)
									}),
										o.appendChild(r)
									let s = document.createElement('div')
									;(s.textContent = E(e.textId)), o.appendChild(s)
								})
							}),
							(this.render = function() {
								c.embedded ||
									((t.element.innerHTML = ''),
									t.renderMenu(),
									t.renderSettings(),
									t.renderLanguageAttribution())
							}),
							(this.renderLanguageAttribution = function() {
								let e = o.getAttribution()
								if (!e) return
								let n = document.createElement('div')
								n.classList.add('header-language-attribution'),
									(n.textContent = e),
									t.element.appendChild(n)
							}),
							(this.init = function() {
								c.embedded || (t.make(), t.render())
							}),
							(this.isMobile = function() {
								return window.innerWidth < 991
							}),
							(this.changeView = function(e) {
								u.change(e)
							}),
							(this.launchSubscribeModal = function() {
								g.modal()
							}),
							(this.menu = [
								{
									icon: ['fa', 'fa-map-marker'],
									id: 'map',
									textId: 'map',
									fn: t.changeView
								},
								{
									icon: ['fa', 'fa-flag-checkered'],
									textId: 'countries',
									onlyIf: t.isMobile,
									fn: t.launchRegionsSearch
								},
								{
									icon: ['fa', 'fa-globe'],
									id: 'toll',
									textId: 'global',
									fn: t.changeView
								},
								{
									icon: ['feather', 'feather-mask'],
									id: 'taiwan',
									textId: 'masks',
									onlyIf: u.showTW,
									fn: t.changeView
								},
								{
									icon: ['fa', 'fa-bolt'],
									id: 'api',
									textId: 'api',
									fn: t.changeView
								},
								{
									icon: ['fa', 'fa-bell'],
									textId: 'stayUpdated',
									fn: t.launchSubscribeModal
								},
								{ icon: ['fa', 'fa-code'], textId: 'embed', fn: t.embedPopup },
								{
									icon: ['fa', 'fa-book'],
									textId: 'creditsAndSources',
									fn: t.sourcesPopup
								},
								{
									icon: ['fa', 'fa-plus-square-o'],
									textId: 'addMissingRegion',
									fn: t.openForm
								},
								{ icon: ['fa', 'fa-at'], textId: 'contactUs', fn: t.openMailTo }
							]),
							this.init()
					})(e.headerSelector)),
					(this.main = new (function(e) {
						let t = this
						;(this.selector = e),
							(this.footer = null),
							(this.init = function() {
								document.querySelector(t.selector).innerHTML = ''
								let n = u.getCurrent()
								n &&
									(n.render(e),
									window.innerWidth < 991 &&
										((t.topbar = new (function(e) {
											let t = this
											;(this.selector = e),
												(this.embedded = c.embedded),
												(this.body = document.querySelector('body')),
												(this.container = document.querySelector(t.selector)),
												(this.countries = new G()),
												(this.element = null),
												(this.make = function() {
													;(t.element = document.createElement('div')),
														t.element.classList.add('app-top-bar'),
														t.container.appendChild(t.element)
												}),
												(this.launchRegionsSearch = function() {
													r.setParam({ query: null }),
														new k({ node: t.body, autofocus: !0 })
												}),
												(this.launchFilterSelection = function(e) {
													let n = [],
														a = 'taiwan' === u.current ? c.masks : c.config
													for (let e in a)
														n.push({
															color: a[e].color,
															bg: a[e].bg,
															name: a[e].name(),
															value: e
														})
													new C(e.target, t.changeMode, n, E('filterMap'))
												}),
												(this.changeMode = function(e) {
													r.setParam({ mode: e }), m.rerender()
												}),
												(this.getQuery = function() {
													return r.getParam('query')
												}),
												(this.render = function() {
													t.element.innerHTML = ''
													let e = document.createElement('div')
													e.classList.add('app-top-bar-inner'),
														t.element.appendChild(e)
													let n = document.createElement('div')
													n.classList.add('app-top-bar-search'),
														n.setAttribute(
															'data-placeholder',
															E('searchRegions') + '...'
														),
														n.addEventListener('click', t.launchRegionsSearch),
														e.appendChild(n)
													let a = document.createElement('div')
													a.classList.add('app-top-bar-search-shortcut'),
														e.appendChild(a)
													let i = document.createElement('div')
													i.classList.add('app-top-bar-special'),
														i.addEventListener('click', function() {
															r.setParam({ selected: null }),
																r.setParam({ query: null }),
																i.classList.add('disabled'),
																u.change('map')
														}),
														e.appendChild(i)
													let o = document.createElement('i')
													if (
														(o.classList.add('fa', 'fa-globe'),
														i.appendChild(o),
														'map' === u.current || 'taiwan' === u.current)
													) {
														let n = document.createElement('i')
														n.classList.add(
															'fa',
															'fa-filter',
															'app-top-bar-search-filter'
														),
															n.addEventListener(
																'click',
																t.launchFilterSelection
															),
															e.appendChild(n)
													}
												}),
												(this.init = function() {
													'api' !== u.current &&
														(t.embedded || (t.make(), t.render()))
												}),
												this.init()
										})(t.selector)),
										(t.drawer = new (function(e, t) {
											let n = this
											;(this.selector = e),
												(this.id = B(22)),
												(this.classNameOpen = 'open'),
												(this.classNameSemi = 'semi'),
												(this.classNameClose = 'close'),
												(this.classNameInit = 'init'),
												(this.classNameTransition = 'transitioning'),
												(this.className = 'drawer'),
												(this.embedded = c.embedded),
												(this.element = null),
												(this.isOpen = !1),
												(this.minimum = 0.01),
												(this.semiOpen = 0.65),
												(this.fullyClosed = 0.95),
												(this.initial = 0.8),
												(this.breakpoint = 0.5),
												(this.autoOpen = 0.2),
												(this.close = function() {
													;(n.isOpen = !1),
														(n.inner.scrollTop = 0),
														n.element.classList.remove(n.classNameOpen),
														n.element.classList.remove(n.classNameInit),
														n.element.classList.add(n.classNameClose),
														n.element.classList.remove(n.classNameSemi),
														n.element.classList.add(n.classNameTransition),
														(n.element.style.top =
															window.innerHeight * n.fullyClosed + 'px')
												}),
												(this.semi = function() {
													setTimeout(function() {
														;(n.isOpen = !1),
															(n.inner.scrollTop = 0),
															n.element.classList.add(n.classNameSemi),
															n.element.classList.remove(n.classNameOpen),
															n.element.classList.remove(n.classNameClose),
															n.element.classList.remove(n.classNameInit),
															n.element.classList.add(n.classNameTransition),
															(n.element.style.top =
																window.innerHeight * n.semiOpen + 'px')
													}, 300)
												}),
												(this.open = function() {
													;(n.isOpen = !0),
														(n.inner.scrollTop = 0),
														n.element.classList.add(n.classNameOpen),
														n.element.classList.remove(n.classNameClose),
														n.element.classList.remove(n.classNameInit),
														n.element.classList.remove(n.classNameSemi),
														n.element.classList.add(n.classNameTransition),
														(n.element.style.top =
															window.innerHeight * n.minimum + 'px')
												}),
												(this.initialize = function() {
													;(n.isOpen = !1),
														(n.inner.scrollTop = 0),
														n.element.classList.remove(n.classNameOpen),
														n.element.classList.remove(n.classNameClose),
														n.element.classList.remove(n.classNameSemi),
														n.element.classList.add(n.classNameInit),
														n.element.classList.add(n.classNameTransition),
														(n.element.style.top =
															window.innerHeight * n.initial + 'px')
												}),
												(this.reposition = function(e) {
													e < window.innerHeight * n.minimum ||
														e > window.innerHeight * n.fullyClosed ||
														((n.isOpen = !1),
														n.element.classList.remove(n.classNameOpen),
														n.element.classList.remove(n.classNameTransition),
														(n.element.style.top = e + 'px'))
												}),
												(this.onTouchMove = function(e) {
													if (n.isOpen) return
													let t = e.touches[0].pageY,
														a = n.inner.scrollTop,
														i = e.target.closest('.section-el-chart')
													i || (0 === a && n.reposition(t - 50))
												}),
												(this.onTouchEnd = function(e) {
													let t = e.changedTouches[0].pageY,
														a = t / window.innerHeight,
														i = n.touchStartY - t,
														o = n.inner.scrollTop
													if (n.isOpen && i < -100 && 0 === o) n.initialize()
													else {
														if (n.isOpen) return
														i > -100 && a < 0.6
															? n.open()
															: i < -100 && a < 0.6
															? n.initialize()
															: a >= 0.6 && a <= 0.8 && i < 0
															? n.initialize()
															: a >= 0.6 && a <= 0.8 && i > 0
															? n.open()
															: a > 0.8 && i > 0
															? n.open()
															: a > 0.8 && i < 0 && n.close()
													}
												}),
												(this.touchStartY = 0),
												(this.onTouchStart = function(e) {
													n.touchStartY = e.changedTouches[0].pageY
												}),
												(this.getSelected = function() {
													return r.getParam('selected')
												}),
												(this.make = function() {
													;(n.element = document.createElement('div')),
														n.element.classList.add(n.className),
														n.element.addEventListener(
															'touchmove',
															n.onTouchMove,
															{ passive: !0 }
														),
														n.element.addEventListener(
															'touchend',
															n.onTouchEnd,
															{ passive: !0 }
														),
														n.element.addEventListener(
															'touchstart',
															n.onTouchStart,
															{ passive: !0 }
														),
														document
															.querySelector(n.selector)
															.prepend(n.element)
													let e = document.createElement('div')
													e.classList.add(
														'feather',
														'feather-x',
														'drawer-close-btn'
													),
														e.addEventListener('click', n.initialize),
														n.element.appendChild(e),
														(n.inner = document.createElement('div')),
														n.inner.classList.add('drawer-inner'),
														n.inner.addEventListener('scroll', function(e) {
															n.inner.scrollTop > 0
																? n.element.classList.add('scrolling')
																: n.element.classList.remove('scrolling')
														}),
														n.inner.setAttribute('id', n.id),
														n.element.appendChild(n.inner),
														n.close()
												}),
												(this.reset = function() {
													n.close()
												}),
												(this.render = function() {
													n.reset(), (n.inner.innerHTML = ''), new H('#' + n.id)
												}),
												(this.removeAll = function() {
													document
														.querySelectorAll('.' + n.className)
														.forEach(function(e) {
															e.remove()
														})
												}),
												(this.init = function() {
													n.removeAll(),
														'toll' !== u.current &&
															'api' !== u.current &&
															'taiwan' !== u.current &&
															'korea' !== u.current &&
															(n.embedded || n.make())
												}),
												this.init()
										})('body'))))
							}),
							this.init()
					})(e.mainSelector)),
					(this.current = r.get()),
					(this.rerender = function() {
						e.sidebar.render(), e.main.init()
					})
			})())
}
const g = new (function() {
	let e = this
	;(this.element = null),
		(this.user = {}),
		(this.storage = new (function() {
			let e = this
			;(this.version = 1),
				(this.get = function(t) {
					if ('undefined' == typeof localStorage || !localStorage) return null
					let n = localStorage.getItem(t)
					if (!n || 'null' === n) return null
					try {
						var a = JSON.parse(n),
							i = a.version,
							o = a.data
						return i && o
							? e.version !== i
								? (localStorage.setItem(t, null), null)
								: o
							: null
					} catch (e) {
						return console.log(e), null
					}
				}),
				(this.save = function(t, n) {
					console.log(n)
					try {
						let i = e.get(t) || {}
						for (var a in (console.log(i), n)) i[a] = n[a]
						let o = JSON.stringify({ version: e.version, data: i })
						return localStorage.setItem(t, o), !0
					} catch (e) {
						return console.log(e), !1
					}
				})
		})()),
		(this.pwa = new (function() {
			let e = this
			;(this.installable = !1),
				(this.prompt = null),
				(this.compatible = !1),
				(this.register = function() {
					window.addEventListener('beforeinstallprompt', t => {
						;(e.compatible = !0), (e.installable = !0), (e.prompt = t)
					})
				}),
				(this.install = function() {
					return new Promise(function(t, n) {
						if (!e.installable) return t(!1)
						let a = document.querySelector('body')
						a.addEventListener(
							'click',
							async function() {
								let n = await e.oninstall()
								return t(n)
							},
							{ once: !0 }
						)
					})
				}),
				(this.oninstall = async function(t) {
					if (!e.prompt) return !1
					e.prompt.prompt()
					let n = await e.prompt.userChoice
					return n && 'accepted' === n.outcome
						? ((e.installable = !1), (e.prompt = null), !0)
						: ((e.installable = !0), !1)
				}),
				this.register()
		})()),
		(this.pushMessages = new (function(e) {
			let t = this
			;(this.denied = !1),
				(this.allowed = !1),
				(this.subscription = null),
				(this.compatible = !0),
				(this.parent = e),
				(this.serverKey =
					'BNdpbMAxfJTui7QMv486YAmWuM6_utcljbFxWk0NavvEbohnnWOYzRVmuL0Mjg_jKibqE2ispj-JTAUK3tMEc2E'),
				(this.config = {
					userVisibleOnly: !0,
					applicationServerKey: (function(e) {
						for (
							var t = '='.repeat((4 - (e.length % 4)) % 4),
								n = (e + t).replace(/\-/g, '+').replace(/_/g, '/'),
								a = window.atob(n),
								i = new Uint8Array(a.length),
								o = 0;
							o < a.length;
							++o
						)
							i[o] = a.charCodeAt(o)
						return i
					})(t.serverKey)
				}),
				(this.isDenied = async function() {
					if (!s || !s.reg || !s.reg.pushManager) return !1
					let e = await s.reg.pushManager.permissionState(t.config)
					return 'denied' === e
				}),
				(this.prompt = async function() {
					let e = await t.getSubscription()
					if (t.subscription) return t.subscription
					if (!e) return null
					try {
						let e = await s.reg.pushManager.subscribe(t.config)
						return e || ((t.denied = !0), null)
					} catch (e) {
						return (t.denied = !0), null
					}
				}),
				(this.getSubscription = function() {
					return new Promise(async function(e, n) {
						return (await t.isDenied())
							? ((t.compatible = !1), e(!1))
							: s && s.reg && s.reg.pushManager
							? void s.reg.pushManager
									.getSubscription()
									.then(function(n) {
										return n
											? ((t.compatible = !0), (t.subscription = n), e(!1))
											: ((t.compatible = !0), e(!0))
									})
									.catch(function(n) {
										return (t.compatible = !1), e(!1)
									})
							: ((t.compatible = !1), e(!1))
					})
				}),
				(this.init = async function() {
					t.allowed = await t.getSubscription()
				}),
				this.init()
		})()),
		(this.userLocation = new D()),
		(this.iubenda = new (function() {
			let e = this
			;(this.cookie = 'cookieConsent'),
				(this.privacyPolicy =
					'https://www.iubenda.com/privacy-policy/37070270'),
				(this.cookiePolicy =
					'https://www.iubenda.com/privacy-policy/37070270/cookie-policy?an=no&s_ck=false&newmarkup=yes'),
				(this.cookies = new U()),
				(this.cookieName = 'cookiesaccepted'),
				(this.getCookie = function() {
					return e.cookies.get(e.cookieName)
				}),
				(this.setCookie = function() {
					e.cookies.set(e.cookieName, 'accepted', 9999)
				}),
				(this.init = function() {
					e.getCookie() || (e.setCookie(), e.cookieConsent())
				}),
				(this.cookieConsent = function() {
					if (c.embedded) return
					let t = document.querySelector('body'),
						n = document.createElement('div')
					n.classList.add('cookie-notice'), t.appendChild(n)
					let a = document.createElement('div')
					a.classList.add('cookie-notice-title'),
						(a.textContent = 'Notice'),
						n.appendChild(a)
					let i = document.createElement('div')
					i.classList.add('cookie-notice-text'),
						(i.innerHTML =
							'\n\t\tThis website or its third-party tools process personal data (e.g. browsing data or IP addresses) and use cookies or other identifiers, which are necessary for its functioning and required to achieve the purposes illustrated in the cookie policy. To learn more, please refer to the <a href="' +
							e.cookiePolicy +
							'" target="_blank">cookie policy</a>.\n\t\tYou accept the use of cookies or other identifiers by closing or dismissing this notice, by scrolling this page, by clicking a link or button or by continuing to browse otherwise.'),
						n.appendChild(i)
					let o = document.createElement('div')
					o.classList.add('cookie-notice-x'),
						o.addEventListener('click', function() {
							n.remove()
						}),
						n.appendChild(o),
						t.addEventListener(
							'click',
							function() {
								n.remove()
							},
							{ once: !0 }
						)
				}),
				this.init()
		})()),
		(this.privacyPolicy = e.iubenda.privacyPolicy),
		(this.terms =
			'https://www.notion.so/coronavirus/Terms-and-conditions-90a31bc4c9e64f54992cb3660e2e5b28'),
		(this.cookiePolicy =
			'https://www.iubenda.com/privacy-policy/37070270/cookie-policy'),
		(this.tabs = [
			{
				icon: 'feather-download',
				name: function() {
					return E('installTheApp')
				},
				onclick: function() {
					e.installPWA()
				},
				compatible: function() {
					return e.pwaIsCompatible()
				},
				done: function() {
					return e.pwaCanBeInstalled()
				},
				disableable: !0
			},
			{
				icon: 'feather-message-square',
				name: function() {
					return E('enablePushNotifications')
				},
				onclick: function() {
					e.enablePushNotifications()
				},
				compatible: function() {
					return e.pushNotificationsCompatible()
				},
				done: function() {
					return e.pushNotificationsEnabled()
				},
				disableable: !0
			},
			{
				icon: 'feather-mail',
				name: function() {
					return E('receiveEmailReports')
				},
				content: function(t) {
					e.createSignUpForm(t)
				},
				done: function() {
					return e.hasSubscribedByEmail()
				},
				disableable: !1
			}
		]),
		(this.hasSubscribedByEmail = function() {
			return !!e.user.email
		}),
		(this.pushNotificationsCompatible = function() {
			let t = e.pushMessages.compatible
			e.user.subscription
			return e.checkPushNotificationDenied(t), !!t
		}),
		(this.pwaIsCompatible = function() {
			let t = e.pwa.compatible,
				n = e.user.appInstalled
			return !(!t && !n)
		}),
		(this.pwaCanBeInstalled = function() {
			return !e.pwa.installable
		}),
		(this.installPWA = async function() {
			let t = await e.pwa.install()
			t && (e.save({ appInstalled: moment().toISOString() }), e.render())
		}),
		(this.pushNotificationsEnabled = function() {
			let t = e.pushMessages.allowed
			return (
				e.checkPushNotificationStatus(t),
				!t && !(!e.user || !e.user.subscription)
			)
		}),
		(this.checkPushNotificationStatus = async function(t) {
			await e.pushMessages.init(), e.pushMessages.allowed !== t && e.render()
		}),
		(this.checkPushNotificationDenied = async function(t) {
			await e.pushMessages.init(), e.pushMessages.compatible !== t && e.render()
		}),
		(this.enablePushNotifications = async function() {
			if (c.embedded) return
			let t = (await e.pushMessages.prompt()) || null
			t && e.save({ subscription: t })
			let n = (await e.userLocation.get()) || null
			n &&
				n.longitude &&
				n.latitude &&
				e.save({ longitude: n.longitude, latitude: n.latitude }),
				e.render()
		}),
		(this.createSignUpForm = function(t) {
			let n = document.createElement('div')
			n.classList.add('sign-up-popup-body'), t.appendChild(n)
			let a = document.createElement('div')
			a.classList.add('sign-up-popup-row'),
				n.appendChild(a),
				(e.firstName = document.createElement('div')),
				e.firstName.classList.add('Input'),
				e.firstName.setAttribute('data-value', e.user.firstName || ''),
				e.firstName.setAttribute('data-placeholder', E('firstName')),
				a.appendChild(e.firstName)
			let i = document.createElement('input')
			i.setAttribute('type', 'text'),
				i.setAttribute('value', e.user.firstName || ''),
				i.addEventListener('input', function(t) {
					e.firstName.setAttribute('data-value', t.target.value),
						(e.user.firstName = t.target.value)
				}),
				e.firstName.appendChild(i),
				(e.lastName = document.createElement('div')),
				e.lastName.classList.add('Input'),
				e.lastName.setAttribute('data-value', e.user.lastName || ''),
				e.lastName.setAttribute('data-placeholder', E('lastName')),
				a.appendChild(e.lastName)
			let o = document.createElement('input')
			o.setAttribute('type', 'text'),
				o.setAttribute('value', e.user.lastName || ''),
				o.addEventListener('input', function(t) {
					e.lastName.setAttribute('data-value', t.target.value),
						(e.user.lastName = t.target.value)
				}),
				e.lastName.appendChild(o)
			let r = document.createElement('div')
			r.classList.add('sign-up-popup-row'),
				n.appendChild(r),
				(e.email = document.createElement('div')),
				e.email.classList.add('Input'),
				e.email.setAttribute('value', e.user.email || ''),
				e.email.setAttribute('data-value', e.user.email || ''),
				e.email.setAttribute('data-placeholder', E('email')),
				r.appendChild(e.email)
			let s = document.createElement('input')
			s.setAttribute('value', e.user.email || ''),
				s.addEventListener('input', function(t) {
					e.email.setAttribute('data-value', t.target.value),
						(e.user.email = t.target.value)
				}),
				s.setAttribute('type', 'email'),
				e.email.appendChild(s),
				(e.error = document.createElement('div')),
				e.error.classList.add('sign-up-popup-error'),
				n.appendChild(e.error)
			let d = document.createElement('div')
			d.classList.add('sign-up-popup-footer'), t.appendChild(d)
			let l = document.createElement('div')
			l.classList.add('sign-up-popup-buttons'), d.appendChild(l)
			let c = document.createElement('button')
			;(c.textContent = E('stayUpdated')),
				c.classList.add('button-primary'),
				c.addEventListener('click', e.validateForm),
				l.appendChild(c)
		}),
		(this.modal = function() {
			;(e.element = document.createElement('div')),
				e.element.classList.add('backdrop'),
				e.element.addEventListener('click', function(t) {
					t.target === t.currentTarget && e.element.remove()
				}),
				document.querySelector('body').appendChild(e.element)
			let t = document.createElement('div')
			t.classList.add('sign-up-popup'), e.element.appendChild(t)
			let n = document.createElement('div')
			n.classList.add('sign-up-popup-header'), t.appendChild(n)
			let a = document.createElement('div')
			a.classList.add('sign-up-popup-back'),
				a.addEventListener('click', e.remove),
				n.appendChild(a)
			let i = document.createElement('div')
			i.classList.add('sign-up-popup-title'),
				(i.textContent = E('stayUpdated')),
				n.appendChild(i)
			let o = document.createElement('div')
			o.classList.add('sign-up-popup-desc'),
				(o.textContent = E('receiveRegularReports')),
				n.appendChild(o)
			let r = document.createElement('div'),
				s = E('bySigningUp'),
				d = s.replace(
					'{pp}',
					'<a href="' +
						e.privacyPolicy +
						'" target="_blank">' +
						E('privacyPolicy') +
						'</a>'
				)
			;(r.innerHTML = d),
				r.classList.add('sign-up-popup-disclaimer'),
				n.appendChild(r),
				(e.container = document.createElement('div')),
				e.container.classList.add('sign-up-popup-inner'),
				t.appendChild(e.container),
				e.render()
		}),
		(this.render = function() {
			;(e.container.innerHTML = ''),
				e.tabs.forEach(function(t, n) {
					let a = document.createElement('div')
					a.classList.add('sign-up-popup-tab'),
						t.done() && a.setAttribute('data-finished', !0),
						t.disableable && t.done() && a.classList.add('disable'),
						t.disableable || t.done() || a.classList.add('open'),
						t.compatible &&
							!t.compatible() &&
							(new M(a, E('noBrowserSupport')),
							a.setAttribute('data-forbidden', 'true')),
						e.container.appendChild(a)
					let i = document.createElement('div')
					i.classList.add('sign-up-popup-tab-inner'),
						t.onclick &&
							i.addEventListener('click', function() {
								console.log('click'), t.onclick()
							}),
						a.appendChild(i)
					let o = document.createElement('div')
					o.classList.add('sign-up-popup-left'),
						(o.innerHTML = '<i class="feather ' + t.icon + '" ></i>'),
						i.appendChild(o)
					let r = document.createElement('div')
					if (
						(r.classList.add('sign-up-popup-right'),
						(r.textContent = t.name()),
						i.appendChild(r),
						t.content)
					) {
						i.addEventListener('click', function() {
							a.classList.toggle('open')
						})
						let e = document.createElement('div')
						e.classList.add('sign-up-popup-tab-container'),
							a.appendChild(e),
							t.content(e)
					}
				})
		}),
		(this.validateForm = function() {
			let t = E('fieldInvalid'),
				n = !e.user.email || !new F(e.user.email).valid(),
				a = !e.user.firstName || e.user.firstName.length < 1,
				i = !e.user.lastName || e.user.lastName.length < 1
			;(e.error.innerHTML = n || a || i ? t : ''),
				a
					? e.firstName.classList.add('invalid')
					: e.firstName.classList.remove('invalid'),
				i
					? e.lastName.classList.add('invalid')
					: e.lastName.classList.remove('invalid'),
				n
					? e.email.classList.add('invalid')
					: e.email.classList.remove('invalid'),
				a ||
					i ||
					n ||
					(e.save({
						email: e.user.email,
						firstName: e.user.firstName,
						lastName: e.user.lastName
					}),
					new R('success', E('profileUpdated')).send())
		}),
		(this.remove = function() {
			e.element.remove()
		}),
		(this.retrieve = function() {
			e.user = e.storage.get('user') || {}
		}),
		(this.save = async function(t) {
			let n = await O('POST', '/subscribe', t)
			e.saveLocally(n.data), e.render()
		}),
		(this.saveLocally = function(t) {
			e.storage.save('user', t), e.retrieve()
		}),
		this.retrieve()
})()
function b(e, t, n, a) {
	let o = this
	;(this.selector = e),
		(this.embedded = a),
		(this.region = t),
		(this.type = n),
		(this.container = document.querySelector(o.selector)),
		(this.element = null),
		(this.additional = null),
		(this.canvas = null),
		(this.reports = null),
		(this.report = null),
		(this.places = null),
		(this.place = null),
		(this.config = null),
		(this.graph = null),
		(this.allowCompare = !0),
		(this.allowSwitch = !0),
		(this.allowSickGraph = !0),
		(this.render = async function() {
			if (
				((o.canvas = document.createElement('canvas')),
				'global' === o.region && 'infected' === o.type)
			)
				(o.allowCompare = !1), await o.globalTollByCountry()
			else if ('global' === o.region && 'dead' === o.type)
				(o.allowCompare = !1), await o.globalTollByCountry()
			else if ('global' === o.region && 'recovered' === o.type)
				(o.allowCompare = !1), await o.globalTollByCountry()
			else if ('global' === o.region && 'sick' === o.type)
				(o.allowCompare = !1), await o.globalTollByCountry()
			else if ('new' === o.region && 'infected' === o.type)
				await o.globalNewCases()
			else if ('new' === o.region && 'dead' === o.type) await o.globalNewCases()
			else if ('new' === o.region && 'recovered' === o.type)
				await o.globalNewCases()
			else if ('new' === o.region && 'sick' === o.type) await o.globalNewCases()
			else if ('evolution' === o.region && 'infected' === o.type)
				await o.globalEvolution()
			else if ('evolution' === o.region && 'dead' === o.type)
				await o.globalEvolution()
			else if ('evolution' === o.region && 'recovered' === o.type)
				await o.globalEvolution()
			else if ('evolution' === o.region && 'sick' === o.type)
				await o.globalEvolution()
			else if (o.region && 'latest' === o.type)
				(o.allowCompare = !1),
					(o.allowSwitch = !1),
					await o.latestReportByCountry()
			else if (o.region && 'infected' === o.type)
				(o.allowSickGraph = !1), await o.evolutionByCountry()
			else if (o.region && 'recovered' === o.type)
				(o.allowSickGraph = !1), await o.evolutionByCountry()
			else if (o.region && 'dead' === o.type)
				(o.allowSickGraph = !1), await o.evolutionByCountry()
			else {
				if (!o.region || 'sick' !== o.type) throw 'Unknown chart type'
				;(o.allowSickGraph = !1), await o.evolutionByCountry()
			}
			if (!o.config) return o.element.remove(), null
			;(o.element.innerHTML = ''),
				o.element.appendChild(o.canvas),
				(o.graph = new (function(e) {
					let t = this
					;(this.type = e.type || ''),
						(this.numbers = e.numbers || []),
						(this.additional = e.additional || []),
						(this.labels = e.labels || []),
						(this.canvas = e.canvas),
						(this.title = e.title || ''),
						(this.defaultColors = [
							'#3498db',
							'#16a085',
							'#f1c40f',
							'#f39c12',
							'#2ecc71',
							'#27ae60',
							'#e67e22',
							'#1abc9c',
							'#d35400',
							'#a94136',
							'#e74c3c',
							'#c0392b',
							'#f69785',
							'#9b59b6',
							'#8e44ad',
							'#bdc3c7',
							'#34495e',
							'#2c3e50',
							'#95a5a6',
							'#7f8c8d',
							'#ec87bf',
							'#d870ad',
							'#9ba37e',
							'#b49255',
							'#b49255',
							'#2980b9'
						]),
						(this.backgroundColor = e.backgroundColor || t.defaultColors),
						(this.borderColor = e.borderColor || t.defaultColors),
						(this.axisXNames = e.axisXNames),
						(this.axisYNames = e.axisYNames),
						(this.isLogarithmic = e.isLogarithmic || !1),
						(this.max = t.numbers[t.numbers.length - 1]),
						(this.chart = null),
						(this.scales = null),
						(this.max = Math.max(...t.numbers)),
						(this.dataLabelAlign = e.dataLabelAlign),
						(this.yAxesNamesCallback =
							e.yAxesNamesCallback ||
							function(e) {
								return e
							}),
						(this.xAxesNamesCallback =
							e.xAxesNamesCallback ||
							function(e) {
								return e
							}),
						(this.labelNamesCallback =
							e.labelNamesCallback ||
							function(e, t) {
								return t.labels[e[0].index]
							}),
						(this.displayDataLabels = !!e.displayDataLabels),
						(this.pointRadius = function() {
							return 0
						}),
						(this.pointRadiusHover = function() {
							return 5
						}),
						(this.pointHitRadius = function() {
							return 10
						}),
						(this.defineMin = function() {
							let e = [...t.numbers]
							t.additional.forEach(function(t) {
								if (!t.numbers) return
								let n = [...t.numbers]
								n.forEach(function(t) {
									e.push(t)
								})
							}),
								e.sort()
							let n = e[0]
							return n > 0 && (n = 0), n
						}),
						(this.makeScales = function() {
							if (
								((t.scales = {
									yAxes: [
										{
											ticks: {
												display: t.axisYNames,
												precision: 0,
												min: t.defineMin(),
												callback: t.yAxesNamesCallback
											}
										}
									],
									xAxes: [
										{
											ticks: {
												display: t.axisXNames,
												precision: 0,
												min: 0,
												mirror: !0,
												callback: t.xAxesNamesCallback
											}
										}
									]
								}),
								!t.isLogarithmic)
							)
								return
							let e = 'horizontalBar' === t.type ? 'xAxes' : 'yAxes'
							;(t.scales[e][0].type = 'logarithmic'),
								(t.scales[e][0].ticks.max = t.max),
								(t.scales[e][0].ticks.callback = function(e, t, n) {
									if (e) return Number(e.toString())
								}),
								(t.scales[e][0].afterBuildTicks = function(e) {
									;(e.ticks = []),
										t.numbers.forEach(function(t) {
											e.ticks.includes(t) || e.ticks.push(t)
										})
								}),
								(t.scales[e][0].ticks.stepSize = 10),
								(t.scales[e][0].ticks.min = 0),
								'horizontalBar' === t.type &&
									((t.scales.xAxes[0].gridLines = { display: !1 }),
									(t.scales.yAxes[0].gridLines = { display: !1 }))
						}),
						(this.makeDatasets = function() {
							let e = []
							return (
								e.push({
									data: t.numbers,
									backgroundColor: t.backgroundColor,
									borderColor: t.borderColor,
									pointBackgroundColor: t.borderColor,
									pointBorderColor: t.borderColor,
									borderWidth: 3,
									pointRadius: t.pointRadius(),
									pointHoverRadius: t.pointRadiusHover(),
									pointHitRadius: t.pointHitRadius()
								}),
								t.additional.forEach(function(n) {
									e.push({
										data: n.numbers,
										backgroundColor: n.bg,
										borderColor: n.color,
										pointBackgroundColor: n.color,
										pointBorderColor: n.color,
										borderWidth: 3,
										pointRadius: t.pointRadius(),
										pointHoverRadius: t.pointRadiusHover(),
										pointHitRadius: t.pointHitRadius()
									})
								}),
								e
							)
						}),
						(this.make = function() {
							t.makeScales(),
								'undefined' != typeof Chart &&
									Chart &&
									(t.chart = new Chart(t.canvas, {
										type: t.type,
										data: { labels: t.labels, datasets: t.makeDatasets() },
										options: {
											title: {
												display: !!t.title,
												text: t.title,
												padding: 20,
												position: 'top',
												fontColor: '#36363c'
											},
											legend: { display: !1 },
											tooltips: { callbacks: { title: t.labelNamesCallback } },
											scales: t.scales,
											plugins: {
												datalabels: {
													clamp: !0,
													align: t.dataLabelAlign,
													borderColor: t.borderColor,
													display: t.displayDataLabels,
													anchor: 'end',
													borderWidth: 3,
													color: '#2a2a2b',
													backgroundColor: '#fff',
													borderRadius: 6,
													padding: { left: 10, top: 3, right: 10, bottom: 3 },
													font: { weight: 'bolder', size: 11 }
												}
											},
											layout: {
												padding: { left: 30, right: 30, top: 30, bottom: 30 }
											},
											responsive: !0,
											maintainAspectRatio: !1
										}
									}))
						}),
						this.make()
				})(o.config))
		}),
		(this.computeHeight = function() {
			if (!o.element) return 0
			let e = o.element.closest('.section-el-chart')
			if (!e) return 0
			let t = e.offsetHeight
			return t || 0
		}),
		(this.make = function() {
			let e = document.querySelector(o.selector)
			;(o.element = document.createElement('div')),
				o.element.classList.add('Embeddable-Chart'),
				e.appendChild(o.element)
			let t = document.createElement('img')
			t.setAttribute('src', new S().icon), o.element.appendChild(t)
		}),
		(this.extractCheckpointNumber = function(e, t, n) {
			if (!n) return
			let a = null
			switch (e) {
				case 'dead':
					a = parseInt(t.dead)
					break
				case 'recovered':
					a = parseInt(t.recovered)
					break
				case 'infected':
					a = parseInt(t.infected)
					break
				case 'sick':
					a = parseInt(t.sick)
					break
				default:
					throw 'this type of chart is not supported'
			}
			a && 'number' == typeof a && n.push(a)
		}),
		(this.globalEvolution = async function() {
			let e = o.type,
				t = o.additional
			await Promise.all([o.getCheckpoints(), o.getLatest()])
			let n = [],
				a = [],
				i = t && o.additional && c.config[o.additional],
				r = []
			o.checkpoints.forEach(function(e, t) {
				if (e.hide) return
				let s = moment.utc(e.id).format('M[/]D')
				moment.utc().format('M[/]D')
				n.push(s),
					o.extractCheckpointNumber(o.type, e, a),
					i && o.extractCheckpointNumber(o.additional, e, r)
			}),
				a.reverse(),
				n.reverse(),
				r.reverse()
			let s = i
					? [
							{
								numbers: r,
								bg: c.config[o.additional].bg,
								color: c.config[o.additional].color
							}
					  ]
					: [],
				d = ''
			switch (e) {
				case 'dead':
					d = E('totalDeadFromCoronavirus')
					break
				case 'recovered':
					d = E('totalRecoveredFromCoronavirus')
					break
				case 'infected':
					d = E('totalInfectedByCoronavirus')
					break
				case 'sick':
					d = E('totalCurrentlySickByCoronavirus')
					break
				default:
					throw 'this type of chart is not supported'
			}
			let l = c.lastUpdated(o.places)
			o.makeHeader(d, l),
				(o.config = {
					type: 'line',
					canvas: o.canvas,
					title: '',
					numbers: a,
					additional: s,
					borderColor:
						'fatality' === e ? c.config.dead.color : c.config[e].color,
					backgroundColor: 'fatality' === e ? c.config.dead.bg : c.config[e].bg,
					labels: n,
					axisXNames: !0,
					axisYNames: !0,
					displayDataLabels: !1
				})
		}),
		(this.latestReportByCountry = async function() {
			await o.getHistory()
			let e = o.place,
				t = e.history || []
			t.sort(v('day')), t.reverse()
			let n = t[0],
				a = E('toll') + ' | ' + e.name
			o.makeHeader(a, e.lastUpdated)
			let i = [
				c.config.infected.name(),
				c.config.dead.name(),
				c.config.recovered.name(),
				c.config.sick.name()
			]
			o.config = {
				type: 'bar',
				title: '',
				canvas: o.canvas,
				numbers: [n.infected, n.dead, n.recovered, n.sick],
				labels: i,
				backgroundColor: [
					c.config.infected.color,
					c.config.dead.color,
					c.config.recovered.color,
					c.config.sick.color
				],
				borderColor: [
					c.config.infected.color,
					c.config.dead.color,
					c.config.recovered.color,
					c.config.sick.color
				],
				displayDataLabels: !0,
				axisXNames: !0,
				axisYNames: !0,
				displayDataLabels: !0,
				dataLabelAlign: 'end'
			}
		}),
		(this.getHistory = async function() {
			o.place || ((o.place = []), (o.place = await i.getHistory(o.region)))
		}),
		(this.getLatest = async function(e) {
			o.places || (o.places = await i.getPlaces())
		}),
		(this.getCheckpoints = async function(e) {
			o.checkpoints || (o.checkpoints = await i.getCheckpoints())
		}),
		(this.makeTypeSwitcher = async function(e, t) {
			if (o.embedded) return
			let n = document.querySelector('body'),
				a = document.createElement('div')
			if (
				(a.classList.add('Embeddable-Chart-Switcher'),
				e.appendChild(a),
				a.addEventListener('click', async function() {
					let e = document.createElement('div')
					e.classList.add('backdrop', 'transparent'),
						e.addEventListener('click', function(t) {
							t.target === t.currentTarget && e.remove()
						}),
						n.appendChild(e)
					let i = document.createElement('div')
					if (
						(i.classList.add('Embeddable-Chart-Switcher-Dropdown'),
						e.appendChild(i),
						'additional' === t)
					) {
						let n = document.createElement('div')
						n.classList.add('Embeddable-Chart-Switcher-Empty'),
							n.addEventListener('click', function() {
								;(o[t] = null), o.init(), e.remove()
							}),
							i.appendChild(n)
					}
					for (let n in c.config) {
						let a = n.toString(),
							r = document.createElement('div')
						if (
							(r.classList.add('Embeddable-Chart-Switcher-Dropdown-Inner'),
							r.addEventListener('click', function() {
								;(o[t] = n), o.init(), e.remove()
							}),
							n === o.type || n === o.additional)
						)
							continue
						if ('sick' === n && !o.allowSickGraph) continue
						i.appendChild(r)
						let s = document.createElement('div')
						s.classList.add('Embeddable-Chart-Switcher-Color'),
							(s.style.background = c.config[a].color),
							r.appendChild(s)
						let d = document.createElement('div')
						d.classList.add('Embeddable-Chart-Switcher-Name'),
							(d.textContent = c.config[a].name()),
							r.appendChild(d)
					}
					new N(i, a, -50, 0)
				}),
				c.config[o[t]])
			) {
				let e = document.createElement('div')
				e.classList.add('Embeddable-Chart-Switcher-Color'),
					(e.style.background = c.config[o[t]].color),
					a.appendChild(e)
				let n = document.createElement('div')
				n.classList.add('Embeddable-Chart-Switcher-Name'),
					(n.textContent = c.config[o[t]].name()),
					a.appendChild(n)
			}
		}),
		(this.extractCheckpointGrowth = function(e, t, n, a, i) {
			if (!e[n - 1]) return
			let o = null
			switch (i) {
				case 'dead':
					o = parseInt(t.dead) - parseInt(e[n - 1].dead)
					break
				case 'recovered':
					o = parseInt(t.recovered) - parseInt(e[n - 1].recovered)
					break
				case 'infected':
					o = parseInt(t.infected) - parseInt(e[n - 1].infected)
					break
				case 'sick':
					o = parseInt(t.sick) - parseInt(e[n - 1].sick)
					break
				default:
					throw 'this type of chart is not supported'
			}
			;(o || 'number' == typeof number) && a.push(o)
		}),
		(this.globalNewCases = async function() {
			let e = o.type,
				t = o.additional
			await Promise.all([o.getCheckpoints(), o.getLatest()])
			let n = [...o.checkpoints]
			n.sort(v('id'))
			let a = [],
				i = [],
				r = [],
				s = t && o.additional && c.config[o.additional]
			n.forEach(function(e, t) {
				if (e.hide) return
				if (0 === t) return
				let d = moment.utc(e.id).format('M[/]D')
				moment()
					.utc()
					.format('M[/]D')
				a.push(d),
					o.extractCheckpointGrowth(n, e, t, i, o.type),
					s && o.extractCheckpointGrowth(n, e, t, r, o.additional)
			})
			let d = s
					? [
							{
								numbers: r,
								bg: c.config[o.additional].color,
								color: c.config[o.additional].color
							}
					  ]
					: [],
				l = c.lastUpdated(o.places)
			o.makeHeader(E('newCasesHistory'), l),
				(o.config = {
					type: 'bar',
					title: '',
					canvas: o.canvas,
					numbers: i,
					additional: d,
					labels: a,
					backgroundColor: c.config[e].color,
					borderColor: c.config[e].color,
					displayDataLabels: !0,
					axisXNames: !0,
					axisYNames: !0,
					displayDataLabels: !1,
					dataLabelAlign: 'end'
				})
		}),
		(this.globalTollByCountry = async function() {
			let e = o.type
			await o.getLatest()
			let t = new G(),
				n = [],
				a = []
			c.countriesAffected(e, o.places).forEach(function(i) {
				let o = parseInt(i[e] || 0)
				n.push(t.name(i.id)), a.push(o)
			})
			let i = c.lastUpdated(o.places)
			o.makeHeader(E('confirmedCasesByCountry'), i),
				o.element.classList.add('long'),
				(o.config = {
					type: 'horizontalBar',
					canvas: o.canvas,
					title: '',
					numbers: a,
					borderColor: c.config[o.type].color,
					backgroundColor: c.config[o.type].color,
					labels: n,
					axisXNames: !1,
					displayDataLabels: !0,
					axisYNames: !0,
					isLogarithmic: !0,
					dataLabelAlign: 'start'
				})
		}),
		(this.evolutionByCountry = async function() {
			let e = o.type,
				t =
					('dead' === o.type || 'infected' === o.type || o.type, o.additional),
				n = t && c.config[t]
			await o.getHistory()
			let a = o.place,
				i = a.history || []
			i.sort(v('day'))
			let r = [],
				s = [],
				d = []
			if (
				(i.forEach(function(a, i) {
					moment.utc(a.day).format('YYYYMMDD'),
						moment()
							.utc()
							.format('YYYYMMDD')
					r.push(parseInt(a[e])), s.push(a.day), n && d.push(parseInt(a[t]))
				}),
				r.length < 2 || s.length < 2)
			)
				return
			let l = n
					? [{ numbers: d, bg: c.config[t].bg, color: c.config[t].color }]
					: [],
				u = E(e) + ' | ' + o.place.name
			o.makeHeader(u, a.lastUpdated),
				(o.config = {
					type: 'line',
					title: '',
					canvas: o.canvas,
					additional: l,
					numbers: r,
					backgroundColor: c.config[e].bg,
					borderColor: c.config[e].color,
					labels: s,
					axisXNames: !0,
					axisYNames: !0,
					displayDataLabels: !1,
					dataLabelAlign: 'center',
					xAxesNamesCallback: function(e) {
						return moment.utc(e).format('M[/]D')
					},
					labelNamesCallback: function(e, t) {
						return moment.utc(t.labels[e[0].index]).format('MMMM Do')
					}
				})
		}),
		(this.init = async function() {
			;(o.container.innerHTML = ''), o.make(), o.render()
		}),
		(this.makeHeader = function(e, t) {
			let n = document.createElement('div')
			n.classList.add('Embeddable-Chart-Header')
			let a = document.createElement('div')
			a.classList.add('Embeddable-Chart-Title'), n.appendChild(a)
			let i = document.createElement('div')
			i.classList.add('Embeddable-Chart-Text'),
				(i.textContent = e),
				a.appendChild(i)
			let r = document.createElement('div')
			r.classList.add('Embeddable-Chart-References'), a.appendChild(r)
			let s = document.createElement('div')
			if (
				(s.classList.add('Embeddable-Chart-Date'),
				r.appendChild(s),
				new I(s, t),
				o.embedded)
			) {
				let e = document.createElement('a')
				e.classList.add('Embeddable-Chart-PoweredBy'),
					e.setAttribute('href', window.location.origin),
					e.setAttribute('target', '_blank'),
					(e.textContent = 'coronavirus.app'),
					r.appendChild(e)
			}
			let d = document.createElement('div')
			if (
				(d.classList.add('Embeddable-Chart-Btns'),
				n.appendChild(d),
				o.allowSwitch && o.makeTypeSwitcher(d, 'type'),
				o.allowCompare && o.makeTypeSwitcher(d, 'additional'),
				!o.embedded)
			) {
				let e = document.createElement('i')
				e.classList.add('Embeddable-Chart-Embed-Btn', 'fa', 'fa-code'),
					d.appendChild(e),
					e.addEventListener('click', function() {
						o.embedPopup(e)
					}),
					new M(e, E('embed'))
			}
			let l = document.querySelector(o.selector)
			l && l.prepend(n)
		}),
		(this.embedPopup = function(e) {
			let t = document.querySelector('body'),
				n = document.createElement('div')
			n.classList.add('backdrop'),
				n.addEventListener('click', function(e) {
					e.target === e.currentTarget && n.remove()
				}),
				t.appendChild(n)
			let a = document.createElement('div')
			a.classList.add('Embeddable-Chart-Embed'), n.appendChild(a)
			let i =
					window.location.origin +
					'/chart/' +
					o.region +
					'/' +
					o.type +
					'?embed=true',
				r = document.createElement('div')
			;(r.textContent = E('embed')), a.appendChild(r)
			let s = document.createElement('code'),
				d = o.computeHeight() || 380
			;(s.textContent =
				'<iframe style="width:100%"; width="560" height="' +
				d +
				'" src="' +
				i +
				'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'),
				a.appendChild(s),
				new N(a, e, 0, 0)
		}),
		this.init()
}
function v(e) {
	let t = 1
	return (
		'-' === e[0] && ((t = -1), (e = e.substr(1))),
		function(n, a) {
			return (n[e] < a[e] ? -1 : n[e] > a[e] ? 1 : 0) * t
		}
	)
}
function y(e) {
	let t = this
	;(this.msg = e.msg),
		(this.button = e.button),
		(this.buttonFn = e.buttonFn),
		(this.loading = e.loading),
		(this.element = null),
		(this.className = 'Content-Unavailable'),
		(this.make = function() {
			if (
				(t.remove(),
				(t.element = document.createElement('div')),
				t.element.classList.add(t.className),
				document.querySelector('body').appendChild(t.element),
				t.msg)
			) {
				let e = document.createElement('div')
				e.classList.add('Content-Unavailable-Wording'),
					(e.innerHTML = t.msg),
					t.element.appendChild(e)
			}
			if (t.button) {
				let e = document.createElement('button')
				e.classList.add('btn-secondary'),
					(e.innerHTML = t.button || ''),
					t.element.appendChild(e),
					t.element.addEventListener(
						'click',
						t.buttonFn ? t.buttonFn : t.onclick
					)
			}
		}),
		(this.onclick = function() {
			t.remove()
		}),
		(this.remove = function() {
			document.querySelectorAll('.' + t.className).forEach(function(e) {
				e.remove()
			})
		}),
		this.make()
}
function E(e) {
	let t = l[e]
	if (!t) throw 'String ' + e + " doesn't exist"
	return t[o.lang] || t.EN
}
function C(e, t, n, a) {
	let i = this
	;(this.node = e),
		(this.callback = t),
		(this.options = n),
		(this.title = a),
		(this.element = null),
		(this.send = function(e) {
			i.callback(e)
		}),
		(this.animate = function() {
			i.inner.classList.add('showing')
		}),
		(this.remove = function() {
			i.inner.classList.remove('showing'),
				setTimeout(function() {
					i.element.remove()
				}, 300)
		}),
		(this.init = function() {
			if (
				((i.element = document.createElement('div')),
				i.element.classList.add('type-filter-backdrop'),
				i.element.addEventListener('click', function(e) {
					e.target === e.currentTarget && i.remove()
				}),
				document.querySelector('body').appendChild(i.element),
				setTimeout(i.animate, 200),
				(i.inner = document.createElement('div')),
				i.inner.classList.add('type-filter'),
				i.element.appendChild(i.inner),
				i.title)
			) {
				let e = document.createElement('div')
				e.classList.add('type-filter-title'),
					(e.textContent = i.title),
					i.inner.appendChild(e)
			}
			let e = document.createElement('div')
			e.classList.add('type-filter-close'),
				e.addEventListener('click', i.remove),
				i.inner.appendChild(e),
				i.options.forEach(function(e) {
					let t = document.createElement('div')
					if (
						(t.classList.add('type-filter-el'),
						t.addEventListener('click', function() {
							i.remove(), i.send(e.value)
						}),
						i.inner.appendChild(t),
						e.color)
					) {
						let n = document.createElement('div')
						n.classList.add('type-filter-color'),
							(n.style.background = e.bg),
							(n.style.border = '2px solid ' + e.color),
							t.appendChild(n)
					}
					if (e.icon) {
						let n = document.createElement('div')
						n.classList.add('type-filter-icon'),
							e.icon.split(' ').forEach(function(e) {
								n.classList.add(e)
							}),
							t.appendChild(n)
					}
					if (e.img) {
						let n = document.createElement('img')
						n.classList.add('type-filter-img'),
							n.setAttribute('src', e.img),
							t.appendChild(n)
					}
					if (e.name) {
						let n = document.createElement('div')
						n.classList.add('type-filter-name'),
							(n.textContent = 'function' == typeof e.name ? e.name() : e.name),
							t.appendChild(n)
					}
				}),
				new N(i.inner, i.node, 0, 0)
		}),
		this.init()
}
function k(e) {
	let t = this
	;(this.container = e.node),
		(this.onRegionHover = e.onRegionHover),
		(this.onSearch = e.onSearch),
		(this.autofocus = e.autofocus),
		(this.element = null),
		(this.embedded = c.embedded),
		(this.countries = new G()),
		(this.input = null),
		(this.cancel = null),
		(this.mode = function() {
			return r.getParam('mode') || 'infected'
		}),
		(this.sorter = t.mode()),
		(this.searching = function() {
			return r.getParam('query') || ''
		}),
		(this.initialQuery = t.searching()),
		(this.searchMap = function(e) {
			e.length > 0
				? t.cancel.classList.remove('hide')
				: t.cancel.classList.add('hide'),
				r.setParam({ query: e || null }),
				(t.input.value = e),
				t.onSearch && 'function' == typeof t.onSearch && t.onSearch(e),
				t.renderRegions()
		}),
		(this.highlightBubble = function(e) {
			t.onRegionHover &&
				'function' == typeof t.onRegionHover &&
				t.onRegionHover(e)
		}),
		(this.createModal = function(e) {
			t.embedded
				? window.open(window.location.origin + '/' + e, '_blank')
				: new T(e)
		}),
		(this.changeSorter = function(e) {
			window.innerWidth > 991
				? t.changeMode(e)
				: (t.changeMode(e), t.renderRegions())
		}),
		(this.startSorter = function(e) {
			new C(e.target, t.changeSorter, t.sorterConfig, E('sortList'))
		}),
		(this.remove = function(e) {
			t.sidebar.remove(), e && r.setParam({ query: null })
		}),
		(this.searchTimer = null),
		(this.onInput = function(e) {
			clearTimeout(t.searchTimer),
				(t.searchTimer = setTimeout(function() {
					t.searchMap(e.target.value)
				}, 300))
		}),
		(this.renderTopbar = function() {
			t.topBar.innerHTML = ''
			let e = document.createElement('div')
			e.classList.add('app-top-bar-inner'), t.topBar.appendChild(e)
			let n = document.createElement('div')
			n.classList.add('app-top-bar-inner-back'),
				n.addEventListener('click', function(e) {
					e.target.classList.add('disabled'), t.remove(!0)
				}),
				e.appendChild(n),
				setTimeout(function() {
					n.classList.add('animate')
				}, 100),
				(t.input = document.createElement('input')),
				t.input.setAttribute('type', 'text'),
				t.input.classList.add('app-top-bar-search'),
				t.input.setAttribute('placeholder', E('searchRegions') + '...'),
				(t.input.value = t.searching() || ''),
				t.input.addEventListener('input', t.onInput),
				e.appendChild(t.input),
				t.autofocus &&
					(t.input.setAttribute('autofocus', !0),
					new (function() {
						;(this.position = function(e, t) {
							if (!e) return
							let n = document.createRange(),
								a = window.getSelection(),
								i = e.childNodes ? e.childNodes[0] : e
							n.setStart(i, t),
								n.collapse(!0),
								a.removeAllRanges(),
								a.addRange(n),
								e.focus(),
								n.detach(),
								(e.scrollTop = e.scrollHeight)
						}),
							(this.set = function(e, t) {
								let n = document.createRange(),
									a = window.getSelection()
								n.selectNodeContents(e),
									n.collapse('end' !== t),
									a.removeAllRanges(),
									a.addRange(n),
									e.focus(),
									n.detach(),
									(e.scrollTop = e.scrollHeight)
							})
					})().set(t.input, 'end'))
			let a = document.createElement('div')
			a.classList.add('map-sidebar-right-btns'),
				e.appendChild(a),
				(t.sort = document.createElement('i')),
				t.sort.classList.add('map-sidebar-sort', 'fa', 'fa-filter'),
				t.sort.addEventListener('click', t.startSorter),
				a.appendChild(t.sort),
				(t.cancel = document.createElement('div')),
				t.cancel.classList.add('map-sidebar-clear'),
				t.searching() || t.cancel.classList.add('hide'),
				t.cancel.addEventListener('click', t.resetInput),
				a.appendChild(t.cancel)
		}),
		(this.launchFilterSelection = function(e) {
			let n = [],
				a = c.config
			for (let e in a)
				n.push({ color: a[e].color, bg: a[e].bg, name: a[e].name(), value: e })
			new C(e.target, t.changeMode, n, E('filterMap'))
		}),
		(this.changeMode = function(e) {
			r.setParam({ mode: e }), t.render(), u.change('map')
		}),
		(this.resetInput = function() {
			;(t.input.value = ''),
				t.input.dispatchEvent(new Event('input')),
				t.onRegionHover || t.remove()
		}),
		(this.make = function() {
			;(t.sidebar = document.createElement('div')),
				t.sidebar.classList.add('map-sidebar'),
				(t.sidebar.innerHTML = ''),
				t.container.appendChild(t.sidebar),
				(t.topBar = document.createElement('div')),
				t.topBar.classList.add('app-top-bar'),
				t.sidebar.appendChild(t.topBar),
				(t.regionList = document.createElement('div')),
				t.regionList.classList.add('map-sidebar-section', 'column'),
				t.sidebar.appendChild(t.regionList)
		}),
		(this.clickOnPlace = function(e) {
			let n = window.innerWidth > 991
			if (n && e.isMaster) t.searchMap(e.name)
			else if (n && !e.isMaster) t.createModal(e.id)
			else if (!n)
				if (
					(r.setParam({ query: null }),
					t.remove(),
					u.content && u.content.adjustZoom && u.content.updateDrawer)
				) {
					let t = e.isMaster ? e.zoom - 2 : e.zoom || 4
					u.content.adjustZoom(t, e.longitude, e.latitude),
						u.content.updateDrawer(e.id),
						setTimeout(function() {
							u.content.highlightBubble(e.id)
						}, 100)
				} else r.setParam({ selected: e.id }), u.change('map')
		}),
		(this.matchSearch = function(e) {
			return c.matchSearch(e)
		}),
		(this.renderRegions = function() {
			t.regionList.innerHTML = ''
			let e = t.mode()
			console.log(e)
			let n = document.createElement('div')
			n.classList.add('map-sidebar-section-content'),
				t.regionList.appendChild(n)
			let a = 0,
				i = 'name' !== e
			c.getAffected(e, i).forEach(function(i) {
				let o = i.id.toString(),
					s = e || 'infected',
					d = '',
					l = 0
				switch (e) {
					case 'recovered':
						l = i.recovered
						break
					case 'infected':
						l = i.infected
						break
					case 'dead':
						l = i.dead
						break
					case 'sick':
						l = i.sick
						break
					case 'fatalityRate':
						;(l = i.fatalityRate), (s = 'dead'), (d = 'percent')
						break
					case 'recoveryRate':
						;(l = i.recoveryRate), (s = 'recovered'), (d = 'percent')
						break
					case 'name':
					case 'date':
						;(l = i.infected), (s = 'infected')
						break
					default:
						l = i.infected
				}
				if (!l) return
				if (!t.matchSearch(i)) return
				if (i.isSub && !r.getParam('query')) return
				let c = document.createElement('div')
				c.classList.add('map-sidebar-section-item'),
					c.addEventListener('mouseenter', function() {
						t.highlightBubble(o)
					}),
					c.addEventListener('click', function() {
						t.clickOnPlace(i)
					}),
					n.appendChild(c),
					(a = parseInt(l))
				let u = document.createElement('div')
				u.classList.add('map-sidebar-section-item-img'), c.appendChild(u)
				let m = document.createElement('img')
				m.setAttribute('src', t.countries.flag(i.country)), u.appendChild(m)
				let p = document.createElement('div')
				p.classList.add('map-sidebar-section-item-details'), c.appendChild(p)
				let h = document.createElement('div')
				h.classList.add('map-sidebar-section-item-title'),
					i.subregions > 1 && h.setAttribute('data-subregions', i.subregions),
					(h.textContent = i.name),
					p.appendChild(h)
				let f = document.createElement('div')
				f.classList.add('map-sidebar-section-item-desc'),
					new I(f, i.lastUpdated),
					p.appendChild(f)
				let g = document.createElement('div')
				g.classList.add('map-sidebar-section-item-nb'),
					s && g.classList.add(s),
					d && g.classList.add(d),
					(g.textContent = P(l)),
					c.appendChild(g)
			})
		}),
		(this.render = function() {
			t.renderTopbar(), t.renderRegions()
		}),
		(this.init = function() {
			t.embedded || (t.make(), t.render())
		}),
		(this.sorterConfig = [
			{
				value: 'infected',
				mode: 'infected',
				name: function() {
					return E('infected')
				},
				color: c.config.infected.color,
				bg: c.config.infected.bg
			},
			{
				value: 'recovered',
				mode: 'recovered',
				name: function() {
					return E('recovered')
				},
				color: c.config.recovered.color,
				bg: c.config.recovered.bg
			},
			{
				value: 'recoveryRate',
				mode: 'recovered',
				name: function() {
					return E('recoveryRate')
				},
				color: c.config.recovered.color,
				bg: c.config.recovered.bg
			},
			{
				value: 'dead',
				mode: 'dead',
				name: function() {
					return E('dead')
				},
				color: c.config.dead.color,
				bg: c.config.dead.bg
			},
			{
				value: 'fatalityRate',
				mode: 'dead',
				name: function() {
					return E('fatalityRate')
				},
				color: c.config.dead.color,
				bg: c.config.dead.bg
			},
			{
				value: 'sick',
				mode: 'sick',
				name: function() {
					return E('sick')
				},
				color: c.config.sick.color,
				bg: c.config.sick.bg
			},
			{
				value: 'date',
				mode: 'infected',
				name: function() {
					return E('lastUpdate')
				},
				icon: 'feather feather-clock'
			},
			{
				value: 'name',
				mode: 'infected',
				name: function() {
					return E('name')
				},
				icon: 'feather feather-align-left'
			}
		]),
		this.init()
}
function w(e) {
	return e
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[ÿ.,!?=+;'"]/g, '')
		.replace(/[\s]/g, ' ')
		.toLowerCase()
}
function S(e) {
	let t = this
	;(this.element = null),
		(this.text = e || ''),
		(this.className = 'loading-screen'),
		(this.icon = window.location.origin + '/assets/img/icons/loading.svg'),
		(this.make = function() {
			;(t.element = document.createElement('div')),
				t.element.classList.add(t.className)
			let e = document.createElement('div')
			e.classList.add('loading-screen-inner'), t.element.appendChild(e)
			let n = document.createElement('img')
			if ((n.setAttribute('src', t.icon), e.appendChild(n), t.text)) {
				let n = document.createElement('div')
				;(n.textContent = t.text), e.appendChild(n)
			}
		}),
		(this.render = function() {
			document.querySelector('body').appendChild(t.element)
		}),
		(this.remove = function() {
			document.querySelectorAll('.' + t.className).forEach(function(e) {
				e.remove()
			})
		}),
		this.make()
}
function T(e) {
	let t = this
	;(this.element = null),
		(this.id = e),
		(this.latestReport = {}),
		(this.place = function() {
			return c.places.find(e => e.id === t.id) || {}
		}),
		(this.remove = function() {
			t.element.querySelector('.map-modal').classList.remove('added'),
				setTimeout(function() {
					t.element.remove()
				}, 50)
			let e = !u.initialIsRegion
			u.change('map', e)
		}),
		(this.charts = ['latest', 'infected']),
		(this.render = function() {
			t.content &&
				((t.content.innerHTML = ''),
				t.charts.forEach(function(e) {
					let n = B(21),
						a = document.createElement('div')
					a.classList.add('map-modal-section'),
						a.setAttribute('id', n),
						t.content.appendChild(a),
						new b('#' + n, t.id, e)
				}))
		}),
		(this.make = function() {
			if (!t.place().id) return
			document.querySelectorAll('.backdrop').forEach(function(e) {
				e.remove()
			}),
				(t.element = document.createElement('div')),
				t.element.classList.add('backdrop'),
				t.element.addEventListener('click', function(e) {
					e.target === e.currentTarget && t.remove()
				}),
				document.querySelector('body').appendChild(t.element),
				(t.modal = document.createElement('div')),
				t.modal.classList.add('map-modal'),
				t.element.appendChild(t.modal),
				setTimeout(function() {
					t.modal.classList.add('added')
				}, 200)
			let e = document.createElement('div')
			e.classList.add('map-modal-inner'), t.modal.appendChild(e)
			let n = document.createElement('div')
			n.classList.add('map-modal-header'), e.appendChild(n)
			let i = document.createElement('div')
			if (
				(i.classList.add('map-modal-back'),
				i.addEventListener('click', function() {
					i.classList.add('disabled'), t.remove()
				}),
				n.appendChild(i),
				t.place().country)
			) {
				let e = document.createElement('img')
				e.classList.add('country-flag'),
					e.setAttribute('src', new G().flag(t.place().country)),
					n.appendChild(e)
			}
			let o = document.createElement('div')
			o.classList.add('map-modal-title'),
				(o.textContent = t.place().name),
				n.appendChild(o)
			let r = document.createElement('div')
			r.classList.add('map-modal-btns'), n.appendChild(r)
			let s = document.createElement('i')
			s.classList.add('feather', 'feather-flag'),
				s.addEventListener('click', function() {
					window.open(a, '_blank')
				}),
				r.appendChild(s)
			let d = document.createElement('i')
			d.classList.add('feather', 'feather-share-2'),
				d.addEventListener('click', function() {
					A(t.place().infected, t.place().name)
				}),
				r.appendChild(d),
				(t.content = document.createElement('div')),
				t.content.classList.add('map-modal-content'),
				e.appendChild(t.content)
		}),
		(this.init = function() {
			u.change(t.id, !0), t.make(), t.render()
		}),
		this.init()
}
function A(e, t) {
	let n = e && e > 1 && t
	new (function(e, t, n) {
		let a = this
		;(this.title = e),
			(this.description = t),
			(this.link = n),
			(this.prompt = async function() {
				if (void 0 !== navigator.share && navigator.share)
					return (
						await navigator.share({
							title: a.title,
							text: a.description,
							url: n
						}),
						!0
					)
			}),
			(this.copy = function() {
				new (function(e) {
					let t = this
					;(this.string = e),
						(this.copier = function(e) {
							e.clipboardData.setData('text/html', t.string),
								e.clipboardData.setData('text/plain', t.string),
								e.preventDefault()
						}),
						(this.copy = function() {
							document.addEventListener('copy', t.copier),
								document.execCommand('copy'),
								document.removeEventListener('copy', t.copier)
						}),
						this.copy()
				})(a.link)
			}),
			(this.init = async function() {
				let e = await a.prompt()
				e || (a.copy(), a.congratulate())
			}),
			(this.congratulate = function() {
				new R('success', E('linkCopied')).send()
			}),
			this.init()
	})(
		n
			? 'Did you know there are ' +
			  e +
			  ' infected by the coronavirus in ' +
			  t +
			  '?'
			: 'The Coronavirus App ',
		n
			? 'View the toll of the coronavirus in ' +
			  t +
			  ' and the rest of the world'
			: 'Track the spread of the coronavirus across the world',
		window.location.href
	)
}
function M(e, t, n) {
	let a = this
	;(this.node = e),
		(this.element = null),
		(this.line1 = t),
		(this.line2 = n),
		(this.className = 'Tooltip'),
		(this.binding = null),
		(this.make = function() {
			let e = document.querySelector('.' + a.className)
			e && e.remove(),
				(a.element = document.createElement('div')),
				a.element.classList.add(a.className)
			let t = document.createElement('div')
			;(t.innerHTML = a.line1), a.element.appendChild(t)
			let n = document.createElement('div')
			n.classList.add('grey'),
				(n.innerHTML = a.line2),
				a.line2 && a.element.appendChild(n),
				document.querySelector('body').appendChild(a.element),
				(a.binding = new N(a.element, a.node, 0, 0)),
				a.node.addEventListener(
					'mouseleave',
					function() {
						a.destroy()
					},
					{ once: !0 }
				)
		}),
		(this.destroy = function() {
			a.element.remove()
		}),
		(this.init = function() {
			a.node.addEventListener('mouseenter', function() {
				a.make()
			})
		}),
		this.init()
}
function N(e, t, n, a, i) {
	let o = this
	;(this.el = e),
		(this.ref = t),
		(this.top = n || 0),
		(this.left = a || 0),
		(this.bindWidth = i),
		(this.timer = null),
		(this.destroy = function() {
			clearInterval(o.timer), (o.timer = null), o.el.remove()
		}),
		(this.bind = function() {
			if (!o.ref || !o.el) return void o.destroy()
			let e = parseInt(o.ref.getBoundingClientRect().top),
				t = o.ref.getBoundingClientRect().left
			if (!e && !t) return void o.destroy()
			let n = o.ref.offsetWidth,
				a = o.ref.offsetHeight,
				r = o.bindWidth ? n : o.el.offsetWidth,
				s = o.el.offsetHeight,
				d = parseInt(e + o.top + a),
				l = t + n / 2 - r / 2 + o.left,
				c = document.querySelector('body').offsetWidth,
				u = document.querySelector('body').offsetHeight
			l + r > c - 10 && (l = c - r - 10),
				d + s > u - 10 && (d = parseInt(u - s - 10)),
				l < 0 && (l = 0),
				d < 0 && (d = 0),
				(o.el.style.top = 10 * (d / 10).toFixed() + 'px'),
				(o.el.style.left = 10 * (l / 10).toFixed() + 'px'),
				i && (o.el.style.width = r + 'px'),
				(o.el.style.visibility = 'visible')
		}),
		(this.go = function() {
			this.bind(), (this.timer = setInterval(o.bind, 200))
		}),
		this.go()
}
function R(e, t, n) {
	let a = this
	;(this.type = e),
		(this.msg = t),
		(this.hideAfter = n || !1 === n ? n : 3e3),
		(this.node = null),
		(this.code = null),
		(this.element = null),
		(this.stylize = function() {
			var e = document.getElementById('NotificationStyle')
			e && e.remove()
			var t = B(20),
				n = window.location.origin,
				a = document.querySelector('head'),
				i = document.createElement('style')
			i.setAttribute('id', 'NotificationStyle'),
				(i.innerHTML =
					'.Notification-error:before{background-image: url(' +
					n +
					'/assets/img/checkmark-error.svg?v=' +
					t +
					')}\n\t\t.Notification-success:before{background-image: url(' +
					n +
					'/assets/img/checkmark-success.svg?v=' +
					t +
					')}\n\t\t.Notification-warning:before{background-image: url(' +
					n +
					'/assets/img/checkmark-error.svg?v=' +
					t +
					')}\n\t\t.Notification-info:before{background-image: url(' +
					n +
					'/assets/img/checkmark-success.svg?v=' +
					t +
					')}'),
				a.appendChild(i)
		}),
		(this.format = function() {
			var e = a.msg
			try {
				e = JSON.parse(a.msg)
			} catch (e) {}
			;('object' == typeof a.msg || e.includes('{') || e.includes('[')) &&
				((a.code = JSON.stringify(e)), (a.msg = 'An error occurred'))
		}),
		(this.send = function() {
			this.msg &&
				(this.destroyAll(),
				this.format(),
				this.stylize(),
				this.make(),
				this.show())
		}),
		(this.make = function() {
			;(a.element = document.createElement('div')),
				a.element.classList.add('Notification'),
				a.element.classList.add('Notification-' + a.type)
			let e = document.createElement('div')
			e.classList.add('Notification-Inner'), a.element.appendChild(e)
			let t = document.createElement('span')
			t.classList.add('Notification-Close'),
				t.addEventListener('click', function() {
					a.hide()
				}),
				a.element.appendChild(t)
			let n = document.createElement('i')
			n.classList.add('feather', 'feather-x'), t.appendChild(n)
			let i = document.createElement('div')
			i.classList.add('Notification-Content'),
				(i.textContent = a.msg),
				e.appendChild(i)
			let o = document.createElement('div')
			o.classList.add('Notification-Code', 'hide'), (o.textContent = a.code)
			let r = document.createElement('div')
			r.classList.add('Notification-Btn'),
				r.addEventListener('click', function() {
					o.classList.remove('hide')
				}),
				a.code && e.appendChild(r),
				a.operationId && e.appendChild(undo),
				a.code && e.appendChild(o),
				document.querySelector('body').appendChild(a.element)
		}),
		(this.show = function() {
			setTimeout(function() {
				a.element.classList.add('visible')
			}, 100),
				a.hideAfter &&
					'number' == typeof a.hideAfter &&
					setTimeout(function() {
						a.hide()
					}, a.hideAfter)
		}),
		(this.hide = function() {
			a.element &&
				(a.element.classList.remove('visible'),
				setTimeout(function() {
					a.destroyAll()
				}, 500))
		}),
		(this.destroyAll = function() {
			var e = document.querySelectorAll('.Notification')
			e &&
				e.forEach(function(e) {
					e.remove()
				})
		})
}
function I(e, t) {
	let n = this
	;(this.node = e),
		(this.date = t),
		(this.timer = null),
		(this.destroy = function() {
			clearInterval(this.timer), (this.timer = null)
		}),
		(this.make = function() {
			n.node || n.destroy(),
				document.querySelector('body').contains(n.node) || n.destroy()
			n.date || moment().toISOString()
			n.node.textContent = E('lastUpdate') + ' ' + n.format()
		}),
		(this.format = function() {
			return moment(n.date)
				.locale(o.lang)
				.fromNow()
		}),
		(this.checkDate = function() {
			moment(n.date).isBefore(moment()) || (n.date = moment().toISOString())
		}),
		(this.start = function() {
			if ((n.checkDate(), !n.node)) throw 'You must specify a node'
			n.make(),
				(this.timer = setInterval(function() {
					n.make()
				}, 500))
		}),
		this.start()
}
function P(e) {
	e || (e = 0)
	let t = 'FR' === o.lang ? ' ' : ',',
		n = e.toString().split('.')
	return (n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, t)), n.join('.')
}
function H(e, t) {
	let n = this
	;(this.element = null),
		(this.selector = e),
		(this.globalOnly = t),
		(this.countries = new G()),
		(this.getSelected = function() {
			return n.globalOnly ? null : r.getParam('selected')
		}),
		(this.findPlace = function() {
			return c.getPlaceById(n.getSelected()) || null
		}),
		(this.findProperty = function(e) {
			let t = n.findPlace()
			return t ? t[e] || 0 : c.calculate([e])
		}),
		(this.calculateInfected = function() {
			return P(n.findProperty('infected'))
		}),
		(this.calculateDead = function() {
			return P(n.findProperty('dead'))
		}),
		(this.calculateRecovered = function() {
			return P(n.findProperty('recovered'))
		}),
		(this.calculateSick = function() {
			return P(n.findProperty('sick'))
		}),
		(this.calculateFatalityRate = function() {
			let e =
				(
					(n.findProperty('dead') / n.findProperty('infected')) * 100 || 0
				).toFixed(2) || 0
			return isFinite(e) || (e = (0).toFixed(2)), e + '%'
		}),
		(this.calculateRecoveryRate = function() {
			let e =
				(
					(n.findProperty('recovered') / n.findProperty('infected')) * 100 || 0
				).toFixed(2) || 0
			return isFinite(e) || (e = (0).toFixed(2)), e + '%'
		}),
		(this.list = [
			{
				name: E('infected'),
				color: c.config.infected.color,
				type: 'nb',
				nb: n.calculateInfected
			},
			{
				name: E('dead'),
				color: c.config.dead.color,
				type: 'nb',
				nb: n.calculateDead
			},
			{
				name: E('recovered'),
				color: c.config.recovered.color,
				type: 'nb',
				nb: n.calculateRecovered
			},
			{
				name: E('sick'),
				color: c.config.sick.color,
				type: 'nb',
				nb: n.calculateSick
			},
			{ name: E('fatalityRate'), type: 'nb', nb: n.calculateFatalityRate },
			{ name: E('recoveryRate'), type: 'nb', nb: n.calculateRecoveryRate },
			{
				name: 'Evolution',
				type: 'chart',
				onlyIf: function() {
					return !n.findPlace()
				},
				chart: function(e) {
					new b('#' + e, 'evolution', 'infected')
				}
			},
			{
				name: 'New cases',
				type: 'chart',
				onlyIf: function() {
					return !n.findPlace()
				},
				chart: function(e) {
					new b('#' + e, 'new', 'infected')
				}
			},
			{
				name: 'Evolution in country',
				onlyIf: function() {
					return n.findPlace() && n.getSelected().length > 4
				},
				type: 'chart',
				chart: function(e) {
					new b('#' + e, n.getSelected(), 'infected')
				}
			}
		]),
		(this.make = function() {
			;(n.element = document.createElement('section')),
				n.element.classList.add('stats'),
				document.querySelector(n.selector).appendChild(n.element)
		}),
		(this.renderPlaceLocation = function() {
			let e = n.findPlace()
			if (!e) return
			let t = document.createElement('div')
			t.classList.add('section-place-details'), n.element.appendChild(t)
			let a = document.createElement('img')
			a.classList.add('section-place-details-flag'),
				a.setAttribute('src', n.countries.flag(e.country)),
				e.isSub &&
					a.addEventListener('click', function() {
						r.setParam({ selected: e.country }), m.rerender()
					}),
				t.appendChild(a)
			let i = document.createElement('div')
			i.classList.add('section-place-details-container'), t.appendChild(i)
			let o = document.createElement('span')
			o.classList.add('section-place-details-name'), i.appendChild(o)
			let s = document.createElement('span')
			;(s.textContent = e.name), o.appendChild(s)
			let d = document.createElement('span')
			d.classList.add('section-place-details-lastupdate'),
				new I(d, e.lastUpdated),
				i.appendChild(d)
		}),
		(this.renderPlaceBtns = function() {
			if ('toll' === u.current) return
			let e = n.findPlace(),
				t = document.createElement('div')
			if (
				(t.classList.add('section-place-btns-container'),
				n.element.appendChild(t),
				e)
			) {
				let e = document.createElement('i')
				e.classList.add('feather', 'feather-flag'),
					e.addEventListener('click', function() {
						window.open(a, '_blank')
					}),
					t.appendChild(e)
			}
			let i = document.createElement('i')
			i.classList.add('feather', 'feather-share-2'),
				i.addEventListener('click', function() {
					A(e ? e.infected : null, e ? e.name : null)
				}),
				t.appendChild(i)
		}),
		(this.renderPlaceSrc = function() {
			let e = n.findPlace()
			if (!e) return
			let t = n.countries.getParam(e.country, 'nationalSource'),
				a = n.countries.getParam(e.country, 'regionalSource'),
				i = e.isSub && a ? a : t
			if (!i) return
			let o = document.createElement('div')
			o.classList.add('section-container-src'),
				(o.textContent = 'Source: ' + i),
				n.element.appendChild(o)
		}),
		(this.render = function() {
			n.renderPlaceLocation(), n.renderPlaceBtns()
			let e = document.createElement('div')
			e.classList.add('section-container'), n.element.appendChild(e)
			n.list.forEach(function(t, n) {
				switch (t.type) {
					case 'nb':
						let n = document.createElement('div')
						n.classList.add('section-el'),
							t.tooltip && new M(n, t.tooltip),
							e.appendChild(n)
						let a = document.createElement('div')
						a.classList.add('section-el-inner'), n.appendChild(a)
						let i = document.createElement('div')
						i.classList.add('section-el-number'),
							(i.textContent = t.nb()),
							a.appendChild(i)
						let o = document.createElement('div')
						o.classList.add('section-el-name'),
							(o.textContent = t.name),
							a.appendChild(o)
						break
					case 'chart':
						let r = document.createElement('div')
						if ((r.classList.add('section-el-chart'), !t.onlyIf())) return
						let s = B(25)
						r.setAttribute('id', s), e.appendChild(r), t.chart(s)
				}
			}),
				n.renderPlaceSrc()
		}),
		this.make(),
		this.render()
}
function D() {
	this.get = function() {
		return new Promise(function(e, t) {
			navigator.geolocation &&
				navigator.geolocation.getCurrentPosition(
					function(t) {
						return e({
							latitude: t.coords.latitude,
							longitude: t.coords.longitude
						})
					},
					function() {
						return e(null)
					}
				)
		})
	}
}
function F(e) {
	;(this.email = e),
		(this.valid = function() {
			if (
				!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(
					e
				)
			)
				return !1
			return !/[%<>?&*^\]\[\/#\{\}\\~;]/.test(e)
		})
}
function B(e) {
	for (
		var t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
			n = '',
			a = 0;
		a < e;
		a++
	)
		n += t.substr(Math.floor(Math.random() * t.length), 1)
	return n
}
function U() {
	;(this.set = function(e, t, n) {
		var a = new Date()
		a.setTime(a.getTime() + 24 * n * 60 * 60 * 1e3)
		var i = 'expires=' + a.toUTCString()
		document.cookie = e + '=' + t + ';' + i + ';path=/'
	}),
		(this.get = function(e) {
			for (
				var t = e + '=',
					n = decodeURIComponent(document.cookie).split(';'),
					a = 0;
				a < n.length;
				a++
			) {
				for (var i = n[a]; ' ' == i.charAt(0); ) i = i.substring(1)
				if (0 == i.indexOf(t)) return i.substring(t.length, i.length)
			}
			return ''
		})
}
function G() {
	let e = this
	;(this.initialized = !1),
		(this.list = [
			{ name: 'Afghanistan', code: 'AF' },
			{ name: 'Aland Islands', code: 'AX' },
			{ name: 'Albania', code: 'AL' },
			{ name: 'Algeria', code: 'DZ' },
			{ name: 'American Samoa', code: 'AS' },
			{ name: 'Andorra', code: 'AD' },
			{ name: 'Angola', code: 'AO' },
			{ name: 'Anguilla', code: 'AI' },
			{ name: 'Antarctica', code: 'AQ' },
			{ name: 'Antigua and Barbuda', code: 'AG' },
			{
				name: 'Argentina',
				code: 'AR',
				longitude: -63.6167,
				latitude: -38.4161
			},
			{ name: 'Armenia', code: 'AM' },
			{ name: 'Aruba', code: 'AW' },
			{
				name: 'Australia',
				code: 'AU',
				nationalSource: 'Australian Department of Health',
				longitude: 133.7751,
				latitude: -25.2744,
				zoom: 4
			},
			{ name: 'Austria', code: 'AT' },
			{ name: 'Azerbaijan', code: 'AZ' },
			{ name: 'Bahamas', code: 'BS' },
			{ name: 'Bahrain', code: 'BH' },
			{ name: 'Bangladesh', code: 'BD' },
			{ name: 'Barbados', code: 'BB' },
			{
				name: 'Belarus',
				code: 'BY',
				longitude: 27.953388,
				latitude: 53.709808
			},
			{ name: 'Belgium', code: 'BE' },
			{ name: 'Belize', code: 'BZ' },
			{ name: 'Benin', code: 'BJ' },
			{ name: 'Bermuda', code: 'BM' },
			{ name: 'Bhutan', code: 'BT' },
			{ name: 'Bolivia', code: 'BO' },
			{ name: 'Bosnia and Herzegovina', code: 'BA' },
			{ name: 'Botswana', code: 'BW' },
			{ name: 'Bouvet Island', code: 'BV' },
			{ name: 'Brazil', code: 'BR' },
			{ name: 'British Indian Ocean Territory', code: 'IO' },
			{ name: 'Brunei Darussalam', code: 'BN' },
			{ name: 'Bulgaria', code: 'BG' },
			{ name: 'Burkina Faso', code: 'BF' },
			{ name: 'Burundi', code: 'BI' },
			{ name: 'Cambodia', code: 'KH' },
			{ name: 'Cameroon', code: 'CM' },
			{
				name: 'Canada',
				code: 'CA',
				longitude: -106.3468,
				latitude: 56.1304,
				zoom: 3
			},
			{ name: 'Cape Verde', code: 'CV' },
			{ name: 'Cayman Islands', code: 'KY' },
			{ name: 'Central African Republic', code: 'CF' },
			{ name: 'Chad', code: 'TD' },
			{ name: 'Chile', code: 'CL' },
			{
				name: 'China',
				code: 'CN',
				longitude: 110.1954,
				latitude: 32.8617,
				zoom: 3
			},
			{ name: 'Christmas Island', code: 'CX' },
			{ name: 'Cocos (Keeling) Islands', code: 'CC' },
			{ name: 'Colombia', code: 'CO' },
			{ name: 'Comoros', code: 'KM' },
			{ name: 'Congo', code: 'CG' },
			{ name: 'Congo, The Democratic Republic of the', code: 'CD' },
			{ name: 'Cook Islands', code: 'CK' },
			{ name: 'Costa Rica', code: 'CR' },
			{ name: "Cote D'Ivoire", code: 'CI' },
			{ name: 'Croatia', code: 'HR' },
			{ name: 'Curaçao', code: 'CW' },
			{ name: 'Cuba', code: 'CU' },
			{ name: 'Cyprus', code: 'CY' },
			{ name: 'Czechia', code: 'CZ', longitude: 15.473, latitude: 49.8175 },
			{ name: 'Denmark', code: 'DK' },
			{ name: 'Djibouti', code: 'DJ' },
			{ name: 'Dominica', code: 'DM' },
			{ name: 'Dominican Republic', code: 'DO' },
			{ name: 'Ecuador', code: 'EC' },
			{ name: 'Egypt', code: 'EG', longitude: 30.8025, latitude: 26.8206 },
			{ name: 'El Salvador', code: 'SV' },
			{ name: 'Equatorial Guinea', code: 'GQ' },
			{ name: 'Eritrea', code: 'ER' },
			{ name: 'Estonia', code: 'EE' },
			{ name: 'Ethiopia', code: 'ET' },
			{ name: 'Falkland Islands (Malvinas)', code: 'FK' },
			{ name: 'Faroe Islands', code: 'FO' },
			{ name: 'Fiji', code: 'FJ' },
			{ name: 'Finland', code: 'FI' },
			{
				name: 'France',
				code: 'FR',
				language: 'Français',
				longitude: 2.693317,
				latitude: 46.565366,
				zoom: 4,
				nationalSource: 'Agence nationale de santé publique',
				regionalSource: 'Agence régionale de santé'
			},
			{ name: 'French Guiana', code: 'GF' },
			{ name: 'French Polynesia', code: 'PF' },
			{ name: 'French Southern Territories', code: 'TF' },
			{ name: 'Gabon', code: 'GA' },
			{ name: 'Gambia', code: 'GM' },
			{ name: 'Georgia', code: 'GE' },
			{
				name: 'Germany',
				code: 'DE',
				language: 'Deutsch',
				longitude: 10.451526,
				latitude: 51.165691,
				zoom: 5
			},
			{ name: 'Ghana', code: 'GH' },
			{ name: 'Gibraltar', code: 'GI' },
			{ name: 'Greece', code: 'GR', longitude: 21.8243, latitude: 39.0742 },
			{ name: 'Greenland', code: 'GL' },
			{ name: 'Grenada', code: 'GD' },
			{ name: 'Guadeloupe', code: 'GP' },
			{ name: 'Guam', code: 'GU' },
			{ name: 'Guatemala', code: 'GT' },
			{ name: 'Guernsey', code: 'GG' },
			{ name: 'Guinea', code: 'GN' },
			{ name: 'Guinea-Bissau', code: 'GW' },
			{ name: 'Guyana', code: 'GY' },
			{ name: 'Haiti', code: 'HT' },
			{ name: 'Heard Island and Mcdonald Islands', code: 'HM' },
			{ name: 'Holy See', code: 'VA' },
			{ name: 'Honduras', code: 'HN' },
			{ name: 'Hong Kong', code: 'HK' },
			{
				name: 'Hungary',
				code: 'HU',
				language: 'Magyar',
				longitude: 19.5033,
				latitude: 47.1625
			},
			{ name: 'Iceland', code: 'IS' },
			{
				name: 'India',
				code: 'IN',
				longitude: 78.9629,
				latitude: 20.5937,
				zoom: 3,
				nationalSource: 'Ministry of Health & Family Welfare'
			},
			{ name: 'Indonesia', code: 'ID' },
			{ name: 'Iran', code: 'IR', longitude: 53.688046, latitude: 32.42791 },
			{ name: 'Iraq', code: 'IQ', longitude: 43.6793, latitude: 33.2232 },
			{ name: 'Ireland', code: 'IE' },
			{ name: 'Isle of Man', code: 'IM' },
			{ name: 'Israel', code: 'IL' },
			{
				name: 'Italy',
				code: 'IT',
				language: 'Italiano',
				longitude: 12.5674,
				latitude: 41.8719,
				zoom: 5
			},
			{ name: 'Jamaica', code: 'JM' },
			{
				name: 'Japan',
				code: 'JP',
				longitude: 138.25293,
				latitude: 36.204823,
				zoom: 5
			},
			{ name: 'Jersey', code: 'JE' },
			{ name: 'Jordan', code: 'JO' },
			{ name: 'Kazakhstan', code: 'KZ' },
			{ name: 'Kenya', code: 'KE' },
			{ name: 'Kiribati', code: 'KI' },
			{ name: 'North Korea', code: 'KP', language: '한국어' },
			{
				name: 'South Korea',
				code: 'KR',
				language: '한국어',
				longitude: 126.99778,
				latitude: 37.568291
			},
			{ name: 'Kosovo', code: 'XK' },
			{ name: 'Kuwait', code: 'KW' },
			{ name: 'Kyrgyzstan', code: 'KG' },
			{ name: 'Laos', code: 'LA' },
			{ name: 'Latvia', code: 'LV' },
			{ name: 'Lebanon', code: 'LB' },
			{ name: 'Lesotho', code: 'LS' },
			{ name: 'Liberia', code: 'LR' },
			{ name: 'Lebannon', code: 'LY' },
			{ name: 'Liechtenstein', code: 'LI' },
			{ name: 'Lithuania', code: 'LT' },
			{ name: 'Luxembourg', code: 'LU' },
			{ name: 'Macao', code: 'MO' },
			{ name: 'Macedonia', code: 'MK' },
			{ name: 'Madagascar', code: 'MG' },
			{ name: 'Malawi', code: 'MW' },
			{ name: 'Malaysia', code: 'MY', longitude: 101.9758, latitude: 4.2105 },
			{ name: 'Maldives', code: 'MV' },
			{ name: 'Mali', code: 'ML' },
			{ name: 'Malta', code: 'MT' },
			{ name: 'Marshall Islands', code: 'MH' },
			{ name: 'Martinique', code: 'MQ' },
			{ name: 'Mauritania', code: 'MR' },
			{ name: 'Mauritius', code: 'MU' },
			{ name: 'Mayotte', code: 'YT' },
			{
				name: 'Mexico',
				code: 'MX',
				longitude: -102.552788,
				latitude: 23.634501,
				nationalSource:
					'Secretaría de Salud Federal, Dirección General de Epidemiología'
			},
			{ name: 'Micronesia, Federated States of', code: 'FM' },
			{ name: 'Moldova, Republic of', code: 'MD' },
			{ name: 'Monaco', code: 'MC' },
			{ name: 'Mongolia', code: 'MN' },
			{ name: 'Montenegro', code: 'ME' },
			{ name: 'Montserrat', code: 'MS' },
			{ name: 'Morocco', code: 'MA' },
			{ name: 'Mozambique', code: 'MZ' },
			{ name: 'Myanmar', code: 'MM' },
			{ name: 'Namibia', code: 'NA' },
			{ name: 'Nauru', code: 'NR' },
			{ name: 'Nepal', code: 'NP' },
			{
				name: 'Netherlands',
				code: 'NL',
				longitude: 5.2913,
				latitude: 52.1326,
				zoom: 5
			},
			{ name: 'Netherlands Antilles', code: 'AN' },
			{ name: 'New Caledonia', code: 'NC' },
			{ name: 'New Zealand', code: 'NZ' },
			{ name: 'Nicaragua', code: 'NI' },
			{ name: 'Niger', code: 'NE' },
			{ name: 'Nigeria', code: 'NG' },
			{ name: 'Niue', code: 'NU' },
			{ name: 'Norfolk Island', code: 'NF' },
			{ name: 'Northern Mariana Islands', code: 'MP' },
			{ name: 'Norway', code: 'NO', longitude: 8.4689, latitude: 60.472 },
			{ name: 'Oman', code: 'OM' },
			{ name: 'Pakistan', code: 'PK' },
			{ name: 'Palau', code: 'PW' },
			{ name: 'Palestine', code: 'PS' },
			{ name: 'Panama', code: 'PA' },
			{ name: 'Papua New Guinea', code: 'PG' },
			{ name: 'Paraguay', code: 'PY' },
			{ name: 'Peru', code: 'PE' },
			{ name: 'Philippines', code: 'PH' },
			{ name: 'Pitcairn', code: 'PN' },
			{ name: 'Poland', code: 'PL', longitude: 19.1451, latitude: 51.9194 },
			{ name: 'Portugal', code: 'PT' },
			{ name: 'Puerto Rico', code: 'PR' },
			{ name: 'Qatar', code: 'QA' },
			{ name: 'Reunion', code: 'RE' },
			{ name: 'Romania', code: 'RO' },
			{ name: 'Russia', code: 'RU' },
			{ name: 'RWANDA', code: 'RW' },
			{ name: 'Saint Helena', code: 'SH' },
			{ name: 'Saint Kitts and Nevis', code: 'KN' },
			{ name: 'Saint Lucia', code: 'LC' },
			{ name: 'Saint Pierre and Miquelon', code: 'PM' },
			{ name: 'Saint Vincent and the Grenadines', code: 'VC' },
			{ name: 'Samoa', code: 'WS' },
			{ name: 'San Marino', code: 'SM' },
			{ name: 'Sao Tome and Principe', code: 'ST' },
			{
				name: 'Saudi Arabia',
				code: 'SA',
				longitude: 45.0792,
				latitude: 23.8859
			},
			{ name: 'Senegal', code: 'SN' },
			{ name: 'Serbia', code: 'RS' },
			{ name: 'Seychelles', code: 'SC' },
			{ name: 'Sierra Leone', code: 'SL' },
			{ name: 'Singapore', code: 'SG', longitude: 103.8198, latitude: 1.3521 },
			{ name: 'Slovakia', code: 'SK' },
			{ name: 'Slovenia', code: 'SI' },
			{ name: 'Solomon Islands', code: 'SB' },
			{ name: 'Somalia', code: 'SO' },
			{ name: 'South Africa', code: 'ZA' },
			{ name: 'South Georgia and the South Sandwich Islands', code: 'GS' },
			{
				name: 'Spain',
				code: 'ES',
				language: 'Español',
				longitude: -3.7492,
				latitude: 40.4637
			},
			{ name: 'Sri Lanka', code: 'LK' },
			{ name: 'Sudan', code: 'SD' },
			{ name: 'Suriname', code: 'SR' },
			{ name: 'Svalbard and Jan Mayen', code: 'SJ' },
			{ name: 'Swaziland', code: 'SZ' },
			{ name: 'Sweden', code: 'SE', longitude: 18.6435, latitude: 60.1282 },
			{ name: 'Switzerland', code: 'CH', longitude: 8.2275, latitude: 46.8182 },
			{ name: 'Syrian Arab Republic', code: 'SY' },
			{
				name: 'Taiwan',
				code: 'TW',
				language: '繁體中文',
				longitude: 121.563698,
				latitude: 25.03841,
				zoom: 5,
				nationalSource: 'Taiwan Centers For Disease Control'
			},
			{ name: 'Tajikistan', code: 'TJ' },
			{ name: 'Tanzania, United Republic of', code: 'TZ' },
			{
				name: 'Thailand',
				code: 'TH',
				longitude: 100.992538,
				latitude: 15.870032
			},
			{ name: 'Timor-Leste', code: 'TL' },
			{ name: 'Togo', code: 'TG' },
			{ name: 'Tokelau', code: 'TK' },
			{ name: 'Tonga', code: 'TO' },
			{ name: 'Trinidad and Tobago', code: 'TT' },
			{ name: 'Tunisia', code: 'TN' },
			{ name: 'Turkey', code: 'TR', longitude: 35.2433, latitude: 38.9637 },
			{ name: 'Turkmenistan', code: 'TM' },
			{ name: 'Turks and Caicos Islands', code: 'TC' },
			{ name: 'Tuvalu', code: 'TV' },
			{ name: 'Uganda', code: 'UG' },
			{ name: 'Ukraine', code: 'UA' },
			{ name: 'UAE', code: 'AE', longitude: 53.8478, latitude: 23.4241 },
			{
				name: 'United Kingdom',
				code: 'GB',
				longitude: -1.17432,
				latitude: 52.355518,
				zoom: 5
			},
			{
				name: 'United States',
				code: 'US',
				longitude: -100.996784,
				latitude: 40.23985,
				zoom: 2
			},
			{ name: 'United States Minor Outlying Islands', code: 'UM' },
			{ name: 'Uruguay', code: 'UY' },
			{ name: 'Uzbekistan', code: 'UZ' },
			{ name: 'Vanuatu', code: 'VU' },
			{ name: 'Venezuela', code: 'VE' },
			{ name: 'Viet Nam', code: 'VN' },
			{ name: 'Virgin Islands, British', code: 'VG' },
			{ name: 'Virgin Islands, U.S.', code: 'VI' },
			{ name: 'Wallis and Futuna', code: 'WF' },
			{ name: 'Western Sahara', code: 'EH' },
			{ name: 'Yemen', code: 'YE' },
			{ name: 'Zambia', code: 'ZM' },
			{ name: 'Zimbabwe', code: 'ZW' },
			{ name: 'Others', code: 'ZZ' }
		]),
		(this.findByName = function(t) {
			for (let n = 0; n < e.list.length; n++) {
				if (w(e.list[n].name) === t) return !0
			}
			return null
		}),
		(this.getParam = function(t, n) {
			if (!t) return null
			t = t.toUpperCase()
			let a = e.list.find(e => e.code === t)
			return a ? a[n] || '' : null
		}),
		(this.flag = function(t) {
			return e.getParam(t, 'flag')
		}),
		(this.name = function(t) {
			return e.getParam(t, 'name')
		}),
		(this.language = function(t) {
			return e.getParam(t, 'language')
		}),
		(this.longitude = function(t) {
			return e.getParam(t, 'longitude')
		}),
		(this.latitude = function(t) {
			return e.getParam(t, 'latitude')
		}),
		(this.zoom = function(t) {
			return e.getParam(t, 'zoom')
		}),
		(this.init = function() {
			if (!e.initialized)
				return (
					e.list.forEach(function(e) {
						e.flag =
							window.location.origin + '/assets/img/flags/' + e.code + '.svg'
					}),
					(e.initialized = !0),
					e.list
				)
		}),
		this.init()
}
function q(e, t) {
	for (var n in t) {
		if (t[n] && !e[n]) return !0
		if (!t[n] && e[n]) return !0
		if (typeof t[n] != typeof e[n]) return !0
		switch (typeof t[n]) {
			case 'string':
			case 'boolean':
			case 'number':
				if (t[n] !== e[n]) return !0
				break
			case 'object':
				if (null === t[n] && null === e[n]) break
				if (null === t[n] && null !== e[n]) return !0
				if (null === e[n] && null !== e[n]) return !0
				if (t[n] instanceof Array == !1) throw t[n] + ' is not valid data'
				if (t[n] instanceof Array && !e[n] instanceof Array) return !0
				if (e[n] instanceof Array && !t[n] instanceof Array) return !0
				if (t[n].length !== e[n].length) return !0
				for (var a = 0; a < t[n].length; a++) {
					if ('string' != typeof t[n][a] && 'number' != typeof t[n][a])
						throw n +
							' > ' +
							t[n][a] +
							' error: properties of data arrays must be strings or numbers'
					if (!1 === e[n].includes(t[n][a])) return !0
				}
				break
			default:
				throw t[n] +
					' is not a valid data type for ' +
					n +
					' (' +
					typeof t[n] +
					')'
		}
	}
	return !1
}
function O(e, t, n, a) {
	let i = d.find(t, n)
	if (i) return i
	let o = new Promise(function(i, o) {
		if ('GET' !== e && 'POST' !== e) return o('the type should be GET or POST')
		let r = { 'Content-Type': 'application/json' }
		if (a) for (let e in a) r[e] = a[e]
		let s = { method: e, headers: r, credentials: 'include' }
		n && (s.body = n ? JSON.stringify(n) : {}),
			fetch(t, s)
				.then(e => {
					if (200 !== e.status && 201 !== e.status) throw e.statusText
					return e.text()
				})
				.then(e => {
					let t = null
					if (e)
						try {
							t = JSON.parse(e)
						} catch (e) {
							console.log(e)
						}
					return i(t)
				})
				.catch(function(e) {
					return console.log(e), o(e)
				})
	})
	return d.register(t, o, n), o
}
