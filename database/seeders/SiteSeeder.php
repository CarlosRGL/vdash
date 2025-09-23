<?php

namespace Database\Seeders;

use App\Models\Site;
use App\Models\SiteCredential;
use App\Models\User;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            // Create users if none exist
            $users = User::factory(5)->create();
        }

        // Real site data from JSON
        $realSites = $this->getRealSitesData();

        // Create real sites
        foreach ($realSites as $siteData) {
            $site = Site::create([
                'name' => $siteData['name'],
                'url' => $siteData['url'],
                'type' => $siteData['type'],
                'team' => $siteData['team'],
                'description' => $siteData['description'] ?? null,
            ]);

            // Create credentials for each site
            SiteCredential::factory()->create([
                'site_id' => $site->id,
            ]);

            // Assign random users to the site
            $site->users()->attach($users->random(rand(1, 3))->pluck('id'));
        }
    }

    /**
     * Get real sites data from the JSON file
     */
    private function getRealSitesData(): array
    {
        return [
            [
                'name' => '79 habitat',
                'url' => 'https://79habitat.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Aquatheque / Maison Régional de l\'Eau (MRE)',
                'url' => 'https://aquatheque.maisonregionaledeleau.org',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Arcins',
                'url' => 'https://www.mairie-arcins.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => 'Fin de contrat 26/04/2025',
            ],
            [
                'name' => 'Arsac',
                'url' => 'https://arsac.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
            [
                'name' => 'Aucamville',
                'url' => 'https://ville-aucamville.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Bassin de Marennes',
                'url' => 'https://www.bassin-de-marennes.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Bischwiller',
                'url' => 'https://ville-bischwiller.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Cap dail',
                'url' => 'https://cap-dail.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Cdc Oleron',
                'url' => 'https://cdc-oleron.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'CDG 83',
                'url' => 'https://cdgvar.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'CDG 84',
                'url' => 'https://cdg84.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Chapet',
                'url' => 'https://chapet.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
            [
                'name' => 'Chateaurenard',
                'url' => 'https://chateaurenard.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Chateaurenard Etoile',
                'url' => 'https://www.etoile-chateaurenard.com',
                'type' => 'other',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Cheran',
                'url' => 'https://cheran.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Claye-Souilly',
                'url' => 'https://claye-souilly.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Collines Isère Nord Communauté',
                'url' => 'https://www.collines.org',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Communauté de Communes du pays Noyonnais',
                'url' => 'https://www.paysnoyonnais.com',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Communauté de communes Médoc Estuaire',
                'url' => 'https://medoc-estuaire.vernalis.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Commune de la Fouillouse',
                'url' => 'https://www.lafouillouse.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Plus chez nous',
            ],
            [
                'name' => 'Commune de Saint Martin de Crau',
                'url' => 'https://saintmartindecrau.vernalis.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'CUA Alençon',
                'url' => 'https://www.cu-alencon.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Cyclad',
                'url' => 'https://cyclad.org',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Eckbolsheim',
                'url' => 'https://eckbolsheim.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'epagehuca',
                'url' => 'https://epagehuca.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Jusqu\'au 30/06/2025',
            ],
            [
                'name' => 'Espace 21',
                'url' => 'https://espace-21.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => '[Fabio], MIGRÉ',
            ],
            [
                'name' => 'Espace eaux vives',
                'url' => 'https://espaceeauxvives.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Fonsorbes',
                'url' => 'https://fonsorbes.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Inlab',
                'url' => 'https://www.inlab-fosberre.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'La Brede Montesquieu',
                'url' => 'https://labrede-montesquieu.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Ledenon',
                'url' => 'https://ledenon.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Lentrepot Lehaillan',
                'url' => 'https://lentrepot-lehaillan.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Lissieu',
                'url' => 'https://www.lissieu.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => 'Jusqu\'au 26/02/2025',
            ],
            [
                'name' => 'Mairie d\'APT',
                'url' => 'https://www.apt.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Mairie de Carbonne',
                'url' => 'https://carbonne.vernalis.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Mairie de Cébazat',
                'url' => 'https://www.cebazat.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => 'Plus chez nous',
            ],
            [
                'name' => 'Mairie de Lignan sur Orb',
                'url' => 'https://www.ville-lignansurorb.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => 'Plus chez nous',
            ],
            [
                'name' => 'Mairie de Meslan',
                'url' => 'https://www.meslan.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Mairie de Saint Gély du Fesc',
                'url' => 'https://www.saintgelydufesc.com',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Mairie de Saint-Aunès',
                'url' => 'https://www.saint-aunes.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => 'Fin de maintenant avril 2026',
            ],
            [
                'name' => 'Mairie de Steenwerck',
                'url' => 'https://www.steenwerck.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Mairie de Vitré',
                'url' => 'https://www.mairie-vitre.com',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => 'Plus chez nous',
            ],
            [
                'name' => 'Mairie Montarnaud',
                'url' => 'https://www.montarnaud.com',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Maison Régionale de l\'Eau (MRE)',
                'url' => 'https://maisonregionaledeleau.org',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Modane',
                'url' => 'https://modane.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Montagnes du Giffre',
                'url' => 'https://montagnesdugiffre.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Pas d\'heb pas de maintenance',
            ],
            [
                'name' => 'Montlucon Communaute',
                'url' => 'https://montlucon-communaute.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Montluçon Prod',
                'url' => 'https://www.montlucon.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Montrabé',
                'url' => 'https://mairie-montrabe.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Musée de la Dentelle Alençon',
                'url' => 'https://museedentelle.cu-alencon.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Old Carbonne',
                'url' => 'https://www.ville-carbonne.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Old médoc estuaire',
                'url' => 'https://www.cc-medoc-estuaire.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'OT Plaine Vallée Tourisme',
                'url' => 'https://plainevallee-tourisme.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Oytier',
                'url' => 'https://oytier.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Pays De Blain',
                'url' => 'https://www.pays-de-blain.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Pays de la Serre',
                'url' => 'https://paysdelaserre.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Pays Diois',
                'url' => 'https://www.paysdiois.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Pilatrhodanien',
                'url' => 'https://pilatrhodanien.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Pusignan',
                'url' => 'https://www.mairie-pusignan.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Plus chez nous',
            ],
            [
                'name' => 'Registrevaldeleyre',
                'url' => 'https://www.registre-valdeleyre.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Resa Ville Haguenau',
                'url' => 'https://resa.haguenau.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Revel Lauragais',
                'url' => 'https://www.revel-lauragais.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Saint Aubin De Medoc',
                'url' => 'https://saint-aubin-de-medoc.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => '#Shun, A deployer & Link MainWP',
            ],
            [
                'name' => 'Saint Jean de Boiseau',
                'url' => 'https://www.saint-jean-de-boiseau.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Saint Mandrier',
                'url' => 'https://ville-saintmandrier.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
            [
                'name' => 'Saint Medard d\'eyrans',
                'url' => 'https://saint-medard-deyrans.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
            [
                'name' => 'Saint Paul et Valmalle',
                'url' => 'https://stpauletvalmalle.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
            [
                'name' => 'Saint Yorre',
                'url' => 'https://www.ville-saint-yorre.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
            [
                'name' => 'Saint-georges-d\'Esperanche',
                'url' => 'https://saintgeorgesdesperanche.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Saint-Jean-Cap-Ferrat',
                'url' => 'https://saint-jean-cap-ferrat.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Scot Nordisere',
                'url' => 'https://scot-nordisere.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'SCOT Rives du Rhone',
                'url' => 'https://www.scot-rivesdurhone.com',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Sem4v',
                'url' => 'https://sem4v.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Sézanne',
                'url' => 'https://ville-sezanne.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Sézanne Tourisme',
                'url' => 'https://www.sezanne-tourisme.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'SICTOBA',
                'url' => 'https://www.sictoba.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'SIMA Coise',
                'url' => 'https://www.sima-coise.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'SM Nappes Plaine du Roussillon',
                'url' => 'https://www.nappes-roussillon.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Soisy Sous Montmorency',
                'url' => 'https://www.soisy-sous-montmorency.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Sybarval',
                'url' => 'https://www.sybarval.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
            [
                'name' => 'Symsageb',
                'url' => 'https://symsageb.vernalis.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Syndicat Centre Herault (SCH)',
                'url' => 'https://syndicat-centre-herault.org',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Syndicat Mixte des Monts d\'Or',
                'url' => 'https://plainesmontsdor.com',
                'type' => 'Drupal',
                'team' => 'vernalis',
                'description' => 'Plus chez nous',
            ],
            [
                'name' => 'Syndicat Mixte du Bassin Versant du Gapeau ( SMBVG)',
                'url' => 'https://www.smbvg.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Syndicat Mixte du Pays du Giennois',
                'url' => 'https://www.loire-pays-giennois.fr',
                'type' => 'SPIP',
                'team' => 'vernalis',
                'description' => 'Plus chez nous',
            ],
            [
                'name' => 'Ternay',
                'url' => 'https://www.ternay.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Vernon',
                'url' => 'https://www.vernon27.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Vernon Coeur de ville',
                'url' => 'https://coeurdeville.vernon27.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Ville alençon',
                'url' => 'https://www.alencon.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Villefranche-de-Lauragais',
                'url' => 'https://www.mairie-villefranchedelauragais.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => null,
            ],
            [
                'name' => 'Vinon Sur Verdon',
                'url' => 'https://vinon-sur-verdon.fr',
                'type' => 'WordPress',
                'team' => 'vernalis',
                'description' => 'Shun, migré',
            ],
        ];
    }
}
